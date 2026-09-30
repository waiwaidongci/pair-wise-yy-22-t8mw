import { workstationRepository } from "../repositories/WorkstationRepository";
import { workstationScheduleRepository } from "../repositories/WorkstationScheduleRepository";
import { scheduleApplicationRepository } from "../repositories/ScheduleApplicationRepository";
import { restorationStepRepository } from "../repositories/RestorationStepRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { createWorkstationScheduleDto } from "../constructors/WorkstationScheduleDtoFactory";
import { createScheduleApplicationDto } from "../constructors/ScheduleApplicationDtoFactory";
import { ScheduleStatus } from "../constants/ScheduleStatus";
import { ScheduleApplicationStatus } from "../constants/ScheduleApplicationStatus";
import { StepStatus } from "../constants/StepStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { httpError } from "../utils/httpError";
import type { ScheduleCreatePayload, ScheduleRetryPayload } from "../types/WorkstationSchedulePayload";

interface Actor {
  id: number;
  role: string;
  name?: string;
}

// 按工位串行化占位临界区：先进入者先占位，后到者拿到占用说明
const locks = new Map<number, Promise<unknown>>();
function withWorkstationLock<T>(workstationId: number, fn: () => T): Promise<T> {
  const prev = locks.get(workstationId) ?? Promise.resolve();
  const run = prev.then(fn, fn);
  locks.set(
    workstationId,
    run.then(
      () => undefined,
      () => undefined
    )
  );
  return run;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

function withinWindow(startIso: string, endIso: string, windowStart: string, windowEnd: string): boolean {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (!(start.getTime() < end.getTime())) return false;
  const sh = start.getHours() * 60 + start.getMinutes();
  const eh = end.getHours() * 60 + end.getMinutes();
  return sh >= toMinutes(windowStart) && eh <= toMinutes(windowEnd);
}

function resolveStep(stepId: number) {
  const step = restorationStepRepository.findAll().find((s: any) => Number(s.id) === stepId);
  if (!step) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "步骤不存在");
  const plan = restorationPlanRepository.findAll().find((p: any) => Number(p.id) === Number((step as any).plan_id));
  return { step, plan, relicId: plan ? Number((plan as any).relic_id) : 0, planId: Number((step as any).plan_id) };
}

function markStepStatus(stepId: number, status: string) {
  const step = restorationStepRepository.findAll().find((s: any) => Number(s.id) === stepId);
  if (step) (step as any).step_status = status;
}

export const scheduleService = {
  listSchedules: () => workstationScheduleRepository.findAll(),
  listApplications: () => scheduleApplicationRepository.findAll(),

  /**
   * 调度员把步骤排进工位。
   * 先落一条 PENDING 待处理申请，再在工位锁内做条件占位：
   * 成功 -> 申请 CONFIRMED + 排程生效，步骤置为已排程；
   * 失败 -> 保留原排程不动，申请保持 PENDING 并写入占用说明，允许重试。
   */
  createSchedule: async (payload: ScheduleCreatePayload, actor: Actor) => {
    const stepId = Number(payload.step_id);
    const workstationId = Number(payload.workstation_id);
    const { step, planId, relicId } = resolveStep(stepId);

    const ws = workstationRepository.findById(workstationId);
    if (!ws) throw httpError(404, ERROR_CODES.WORKSTATION_NOT_FOUND, ERROR_MESSAGES.WORKSTATION_NOT_FOUND);
    if (ws.status !== "ACTIVE") throw httpError(409, ERROR_CODES.WORKSTATION_CLOSED, ERROR_MESSAGES.WORKSTATION_CLOSED);
    if (!withinWindow(payload.scheduled_start, payload.scheduled_end, ws.window_start, ws.window_end)) {
      throw httpError(422, ERROR_CODES.OUTSIDE_TIME_WINDOW, ERROR_MESSAGES.OUTSIDE_TIME_WINDOW);
    }

    return withWorkstationLock(ws.id, () => {
      const nowIso = new Date().toISOString();
      const app = createScheduleApplicationDto({
        id: scheduleApplicationRepository.nextId(),
        step_id: stepId,
        plan_id: planId,
        relic_id: relicId,
        workstation_id: ws.id,
        requested_start: payload.scheduled_start,
        requested_end: payload.scheduled_end,
        status: ScheduleApplicationStatus[0],
        attempts: 1,
        created_by: actor.id,
        created_at: nowIso,
        updated_at: nowIso
      });
      scheduleApplicationRepository.save(app);

      const candidate = createWorkstationScheduleDto({
        id: workstationScheduleRepository.nextId(),
        step_id: stepId,
        plan_id: planId,
        relic_id: relicId,
        workstation_id: ws.id,
        scheduled_start: payload.scheduled_start,
        scheduled_end: payload.scheduled_end,
        status: ScheduleStatus[0],
        occupied_by: actor.id,
        occupied_by_name: actor.name ?? `用户 ${actor.id}`,
        occupied_at: nowIso,
        version: 1,
        created_at: nowIso
      });

      const result = workstationScheduleRepository.occupySlot(candidate, ws.capacity);
      if (!result.ok) {
        scheduleApplicationRepository.update(app.id, {
          status: ScheduleApplicationStatus[0],
          last_error_code: ERROR_CODES.SLOT_OCCUPIED,
          last_error_message: ERROR_MESSAGES.SLOT_OCCUPIED,
          occupied_by_name: result.occupiedBy?.occupied_by_name ?? null
        });
        throw httpError(409, ERROR_CODES.SLOT_OCCUPIED, ERROR_MESSAGES.SLOT_OCCUPIED, {
          application: scheduleApplicationRepository.findById(app.id),
          occupiedBy: result.occupiedBy
        });
      }

      scheduleApplicationRepository.update(app.id, {
        status: ScheduleApplicationStatus[1],
        last_error_code: null,
        last_error_message: null,
        occupied_by_name: null
      });
      markStepStatus(stepId, StepStatus[1]);
      return { schedule: result.schedule, application: scheduleApplicationRepository.findById(app.id) };
    });
  },

  /**
   * 重试待处理申请：重新走占位临界区。
   * 原排程始终保留，重试成功才新增排程；失败则继续保留 PENDING 与占用说明。
   */
  retryApplication: async (applicationId: number, actor: Actor, overrides: ScheduleRetryPayload = {}) => {
    const app = scheduleApplicationRepository.findById(applicationId);
    if (!app) throw httpError(404, ERROR_CODES.APPLICATION_NOT_FOUND, ERROR_MESSAGES.APPLICATION_NOT_FOUND);
    if (app.status === ScheduleApplicationStatus[1]) {
      throw httpError(409, ERROR_CODES.APPLICATION_NOT_RETRYABLE, ERROR_MESSAGES.APPLICATION_NOT_RETRYABLE);
    }

    const workstationId = Number(overrides.workstation_id ?? app.workstation_id);
    const start = overrides.scheduled_start ?? app.requested_start;
    const end = overrides.scheduled_end ?? app.requested_end;

    const ws = workstationRepository.findById(workstationId);
    if (!ws) throw httpError(404, ERROR_CODES.WORKSTATION_NOT_FOUND, ERROR_MESSAGES.WORKSTATION_NOT_FOUND);
    if (ws.status !== "ACTIVE") throw httpError(409, ERROR_CODES.WORKSTATION_CLOSED, ERROR_MESSAGES.WORKSTATION_CLOSED);
    if (!withinWindow(start, end, ws.window_start, ws.window_end)) {
      throw httpError(422, ERROR_CODES.OUTSIDE_TIME_WINDOW, ERROR_MESSAGES.OUTSIDE_TIME_WINDOW);
    }

    return withWorkstationLock(ws.id, () => {
      const nowIso = new Date().toISOString();
      const candidate = createWorkstationScheduleDto({
        id: workstationScheduleRepository.nextId(),
        step_id: app.step_id,
        plan_id: app.plan_id,
        relic_id: app.relic_id,
        workstation_id: ws.id,
        scheduled_start: start,
        scheduled_end: end,
        status: ScheduleStatus[0],
        occupied_by: actor.id,
        occupied_by_name: actor.name ?? `用户 ${actor.id}`,
        occupied_at: nowIso,
        version: 1,
        created_at: nowIso
      });

      const result = workstationScheduleRepository.occupySlot(candidate, ws.capacity);
      if (!result.ok) {
        scheduleApplicationRepository.update(app.id, {
          status: ScheduleApplicationStatus[0],
          attempts: app.attempts + 1,
          workstation_id: ws.id,
          requested_start: start,
          requested_end: end,
          last_error_code: ERROR_CODES.SLOT_OCCUPIED,
          last_error_message: ERROR_MESSAGES.SLOT_OCCUPIED,
          occupied_by_name: result.occupiedBy?.occupied_by_name ?? null
        });
        throw httpError(409, ERROR_CODES.SLOT_OCCUPIED, ERROR_MESSAGES.SLOT_OCCUPIED, {
          application: scheduleApplicationRepository.findById(app.id),
          occupiedBy: result.occupiedBy
        });
      }

      scheduleApplicationRepository.update(app.id, {
        status: ScheduleApplicationStatus[1],
        attempts: app.attempts + 1,
        workstation_id: ws.id,
        requested_start: start,
        requested_end: end,
        last_error_code: null,
        last_error_message: null,
        occupied_by_name: null
      });
      markStepStatus(app.step_id, StepStatus[1]);
      return { schedule: result.schedule, application: scheduleApplicationRepository.findById(app.id) };
    });
  },

  /**
   * 文物状态变更：把该文物所有「未开始」排程置为 INVALID，步骤回退为待排程，
   * 并返回提示重排说明。
   */
  invalidateUnstartedByRelic: (relicId: number, reason: string) => {
    const now = Date.now();
    const targets = workstationScheduleRepository
      .findAll()
      .filter(
        (s) =>
          Number(s.relic_id) === relicId &&
          s.status === ScheduleStatus[0] &&
          new Date(s.scheduled_start).getTime() > now
      );
    targets.forEach((s) => {
      workstationScheduleRepository.update(s.id, { status: ScheduleStatus[1], invalid_reason: reason });
      markStepStatus(s.step_id, StepStatus[0]);
    });
    return {
      invalidated: targets,
      notice: `文物状态已变更，${targets.length} 条未开始排程失效，请重新排程`
    };
  },

  /**
   * 方案内容变更：把该方案下所有「未开始」排程置为 INVALID，步骤回退为待排程。
   */
  invalidateUnstartedByPlan: (planId: number, reason: string) => {
    const now = Date.now();
    const targets = workstationScheduleRepository
      .findAll()
      .filter(
        (s) =>
          Number(s.plan_id) === planId &&
          s.status === ScheduleStatus[0] &&
          new Date(s.scheduled_start).getTime() > now
      );
    targets.forEach((s) => {
      workstationScheduleRepository.update(s.id, { status: ScheduleStatus[1], invalid_reason: reason });
      markStepStatus(s.step_id, StepStatus[0]);
    });
    return {
      invalidated: targets,
      notice: `方案内容已变更，${targets.length} 条未开始排程失效，请重新排程`
    };
  }
};
