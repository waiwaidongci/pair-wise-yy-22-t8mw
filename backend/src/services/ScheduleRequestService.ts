import { scheduleRequestRepository } from "../repositories/ScheduleRequestRepository";
import { workstationRepository } from "../repositories/WorkstationRepository";
import { restorationStepRepository } from "../repositories/RestorationStepRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { createScheduleRequestDto } from "../constructors/ScheduleRequestDtoFactory";
import { HttpError } from "../utils/httpError";
import { withWorkstationLock } from "../utils/workstationLock";
import { isWithinWindow, countOverlappingConfirmed, findOccupant } from "../utils/scheduleGuard";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { CreateScheduleRequestPayload } from "../types/ScheduleRequestPayload";
import type { ScheduleRequest } from "../models/ScheduleRequest";
import type { Workstation } from "../models/Workstation";

const nextId = () =>
  scheduleRequestRepository.findAll().reduce((max, row) => Math.max(max, row.id), 0) + 1;

const validatePayload = (payload: Partial<CreateScheduleRequestPayload>) => {
  if (
    typeof payload.step_id !== "number" ||
    typeof payload.workstation_id !== "number" ||
    typeof payload.start_at !== "string" ||
    typeof payload.end_at !== "string"
  ) {
    throw new HttpError(400, "VALIDATION_FAILED");
  }
  return payload as CreateScheduleRequestPayload;
};

const loadSchedulingContext = (payload: CreateScheduleRequestPayload) => {
  const step = restorationStepRepository.findById(payload.step_id);
  if (!step) throw new HttpError(404, "VALIDATION_FAILED", { field: "step_id" });
  const plan = restorationPlanRepository.findById(step.plan_id);
  if (!plan) throw new HttpError(404, "VALIDATION_FAILED", { field: "plan_id" });
  if (plan.approval_status !== "APPROVED") {
    throw new HttpError(409, "SCHEDULE_PLAN_NOT_APPROVED", { plan_id: plan.id, approval_status: plan.approval_status });
  }
  if (step.step_status !== "PENDING") {
    throw new HttpError(409, "SCHEDULE_STEP_NOT_PENDING", { step_id: step.id, step_status: step.step_status });
  }
  const workstation = workstationRepository.findById(payload.workstation_id);
  if (!workstation || !workstation.active) {
    throw new HttpError(404, "VALIDATION_FAILED", { field: "workstation_id" });
  }
  return { step, plan, workstation };
};

// Attempts to confirm a request inside the workstation lock. On conflict the
// request stays PENDING with an occupancy note (the pending application is
// never discarded) and an HttpError is surfaced to the caller.
const tryConfirm = (request: ScheduleRequest, workstation: Workstation): ScheduleRequest => {
  const confirmed = scheduleRequestRepository.findConfirmedForWorkstation(workstation.id);
  if (!isWithinWindow(workstation, request.start_at, request.end_at)) {
    const marked = scheduleRequestRepository.update(request.id, {
      conflict_reason: `工位 ${workstation.code} 服务时间为 ${workstation.open_from}-${workstation.open_until}，申请时段超出时间窗`,
      conflict_workstation_id: workstation.id
    })!;
    throw new HttpError(409, "SCHEDULE_OUTSIDE_WINDOW", { request: marked });
  }

  const overlapping = countOverlappingConfirmed(confirmed, request.start_at, request.end_at);
  if (overlapping >= workstation.capacity) {
    const occupant = findOccupant(confirmed, request.start_at, request.end_at);
    const marked = scheduleRequestRepository.update(request.id, {
      conflict_reason: `工位 ${workstation.code} 该时段容量 ${workstation.capacity} 已满，先到申请 #${occupant?.id ?? "?"} 已占位`,
      conflict_workstation_id: workstation.id,
      occupied_by_request_id: occupant?.id ?? null
    })!;
    throw new HttpError(409, "SCHEDULE_SLOT_OCCUPIED", {
      request: marked,
      workstation: { id: workstation.id, code: workstation.code, capacity: workstation.capacity },
      occupied_by_request_id: occupant?.id ?? null,
      occupied_start_at: occupant?.start_at ?? null,
      occupied_end_at: occupant?.end_at ?? null
    });
  }

  // Only after every guard passes do we write the confirmed place. The step
  // stays PENDING — scheduling never moves it to IN_PROGRESS.
  const decidedAt = new Date().toISOString();
  const confirmedRequest = scheduleRequestRepository.update(request.id, {
    status: "CONFIRMED",
    decided_at: decidedAt,
    conflict_reason: null,
    conflict_workstation_id: null,
    occupied_by_request_id: null
  })!;
  restorationStepRepository.update(request.step_id, {
    step_status: "PENDING",
    scheduled_workstation_id: workstation.id,
    scheduled_start_at: request.start_at,
    scheduled_end_at: request.end_at
  });
  return confirmedRequest;
};

export const scheduleRequestService = {
  list: (): ScheduleRequest[] => scheduleRequestRepository.findAll(),

  request: async (rawPayload: Partial<CreateScheduleRequestPayload>, actorId: number): Promise<ScheduleRequest> => {
    const payload = validatePayload(rawPayload);
    const { workstation } = loadSchedulingContext(payload);

    // The request record is persisted first and retained even if booking fails.
    const draft = createScheduleRequestDto({
      id: nextId(),
      step_id: payload.step_id,
      workstation_id: payload.workstation_id,
      requested_by: actorId,
      start_at: payload.start_at,
      end_at: payload.end_at,
      status: "PENDING",
      created_at: new Date().toISOString()
    });
    const stored = scheduleRequestRepository.save(draft);
    console.info(LOG_TEMPLATES.ScheduleRequest[0], stored.id);

    try {
      const confirmedRequest = await withWorkstationLock(workstation.id, () =>
        Promise.resolve().then(() => tryConfirm(stored, workstation))
      );
      console.info(LOG_TEMPLATES.ScheduleRequest[1], confirmedRequest.id);
      return confirmedRequest;
    } catch (error) {
      // A failure while writing the place must not destroy either the existing
      // schedule or this pending request; the dispatcher can retry it as-is.
      if (error instanceof HttpError) throw error;
      scheduleRequestRepository.update(stored.id, {
        conflict_reason: "占位写入失败，已保留原排程与待处理申请，可重试"
      });
      throw new HttpError(503, "SCHEDULE_WRITE_FAILED", { request_id: stored.id });
    }
  },

  retry: async (requestId: number): Promise<ScheduleRequest> => {
    const request = scheduleRequestRepository.findById(requestId);
    if (!request) throw new HttpError(404, "VALIDATION_FAILED", { field: "id" });
    if (request.status === "INVALIDATED") {
      throw new HttpError(409, "SCHEDULE_INVALIDATED", { request });
    }
    if (request.status === "CONFIRMED") {
      throw new HttpError(409, "SCHEDULE_REQUEST_NOT_PENDING", { request });
    }
    const workstation = workstationRepository.findById(request.workstation_id);
    if (!workstation) throw new HttpError(404, "VALIDATION_FAILED", { field: "workstation_id" });
    // Re-validate plan/step state before attempting the place again.
    loadSchedulingContext({
      step_id: request.step_id,
      workstation_id: request.workstation_id,
      start_at: request.start_at,
      end_at: request.end_at
    });
    console.info(LOG_TEMPLATES.ScheduleRequest[3], request.id);
    return withWorkstationLock(workstation.id, () =>
      Promise.resolve().then(() => tryConfirm(request, workstation))
    );
  }
};
