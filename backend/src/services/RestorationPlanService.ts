import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { scheduleService } from "./ScheduleService";
import { PlanApprovalStatus } from "../constants/PlanApprovalStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { httpError } from "../utils/httpError";

export const restorationPlanService = {
  list: () => restorationPlanRepository.findAll(),
  create: (row: unknown) => restorationPlanRepository.save(row),

  /**
   * 方案内容变更：更新后触发该方案下未开始排程失效，返回提示重排说明。
   */
  update: (id: number, patch: Record<string, unknown>) => {
    const row = restorationPlanRepository.findAll().find((p: any) => Number(p.id) === id);
    if (!row) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "方案不存在");
    Object.assign(row, patch, { id: (row as any).id });
    const invalidation = scheduleService.invalidateUnstartedByPlan(id, "方案内容变更");
    return { plan: row, invalidation };
  },

  /**
   * 专家审批：仍由专家处理，通过后方案进入 APPROVED。
   */
  approve: (id: number) => {
    const row = restorationPlanRepository.findAll().find((p: any) => Number(p.id) === id);
    if (!row) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "方案不存在");
    (row as any).approval_status = PlanApprovalStatus[2];
    return row;
  },

  reject: (id: number) => {
    const row = restorationPlanRepository.findAll().find((p: any) => Number(p.id) === id);
    if (!row) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "方案不存在");
    (row as any).approval_status = PlanApprovalStatus[3];
    return row;
  }
};
