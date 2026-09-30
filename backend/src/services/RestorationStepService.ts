import { restorationStepRepository } from "../repositories/RestorationStepRepository";
import { workstationScheduleRepository } from "../repositories/WorkstationScheduleRepository";
import { StepStatus } from "../constants/StepStatus";
import { ScheduleStatus } from "../constants/ScheduleStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { httpError } from "../utils/httpError";

interface Actor {
  id: number;
  role: string;
}

export const restorationStepService = {
  list: () => restorationStepRepository.findAll(),
  create: (row: unknown) => restorationStepRepository.save(row),

  /**
   * 修复师执行分给自己的步骤。
   * 守卫：
   * 1. 只能执行分配给本人（operator_id）的步骤；
   * 2. 必须存在有效排程（未失效）；
   * 3. 未到排程开始时间不得提前进入进行中；
   * 4. 状态不得跳级（未开始 -> 进行中 -> 已完成）。
   */
  transition: (stepId: number, action: "start" | "complete", actor: Actor) => {
    const step = restorationStepRepository.findAll().find((s: any) => Number(s.id) === stepId);
    if (!step) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "步骤不存在");

    if (action === "start") {
      if (Number((step as any).operator_id) !== actor.id) {
        throw httpError(403, ERROR_CODES.STEP_NOT_ASSIGNED, ERROR_MESSAGES.STEP_NOT_ASSIGNED);
      }
      const schedule = workstationScheduleRepository
        .findValidByStep(stepId)
        .find((s) => s.status === ScheduleStatus[0]);
      if (!schedule) {
        throw httpError(409, ERROR_CODES.STEP_NOT_SCHEDULED, ERROR_MESSAGES.STEP_NOT_SCHEDULED);
      }
      if (new Date(schedule.scheduled_start).getTime() > Date.now()) {
        throw httpError(409, ERROR_CODES.STEP_NOT_STARTABLE, ERROR_MESSAGES.STEP_NOT_STARTABLE, {
          scheduled_start: schedule.scheduled_start
        });
      }
      const allowedFrom = [StepStatus[0], StepStatus[1]];
      if (!allowedFrom.includes((step as any).step_status)) {
        throw httpError(409, ERROR_CODES.STEP_STATE_INVALID, ERROR_MESSAGES.STEP_STATE_INVALID);
      }
      (step as any).step_status = StepStatus[2];
      return { step, schedule };
    }

    if (action === "complete") {
      if (Number((step as any).operator_id) !== actor.id) {
        throw httpError(403, ERROR_CODES.STEP_NOT_ASSIGNED, ERROR_MESSAGES.STEP_NOT_ASSIGNED);
      }
      if ((step as any).step_status !== StepStatus[2]) {
        throw httpError(409, ERROR_CODES.STEP_STATE_INVALID, "步骤未在进行中，不能完成");
      }
      (step as any).step_status = StepStatus[3];
      (step as any).finished_at = new Date().toISOString();
      return { step };
    }

    throw httpError(400, ERROR_CODES.VALIDATION_FAILED, "未知的步骤动作");
  }
};
