import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { restorationStepRepository } from "../repositories/RestorationStepRepository";
import { scheduleRequestRepository } from "../repositories/ScheduleRequestRepository";
import { HttpError } from "../utils/httpError";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RestorationPlan } from "../models/RestorationPlan";
import type { RelicItem } from "../models/RelicItem";

// Any relic condition change or approved-plan content change invalidates every
// not-yet-started schedule under that plan and clears the step place so the
// dispatcher must reschedule. Started/completed steps are left untouched.
export const invalidatePlanSchedule = (planId: number, reason: string) => {
  const steps = restorationStepRepository.findByPlanId(planId);
  const notStarted = steps.filter((step) => step.step_status === "PENDING");
  const stepIds = notStarted.map((step) => step.id);
  const invalidated = scheduleRequestRepository.invalidateForPlan(planId, stepIds, reason);
  notStarted.forEach((step) =>
    restorationStepRepository.update(step.id, {
      scheduled_workstation_id: null,
      scheduled_start_at: null,
      scheduled_end_at: null
    })
  );
  if (invalidated.length > 0) console.info(LOG_TEMPLATES.ScheduleRequest[4], planId, invalidated.length);
  return invalidated;
};

export const restorationPlanService = {
  list: (): RestorationPlan[] => restorationPlanRepository.findAll(),
  create: (row: unknown): RestorationPlan => restorationPlanRepository.save(row as RestorationPlan),

  // Experts still own approval.
  approve: (id: number): RestorationPlan => {
    const plan = restorationPlanRepository.findById(id);
    if (!plan) throw new HttpError(404, "VALIDATION_FAILED", { field: "id" });
    if (plan.approval_status !== "SUBMITTED") {
      throw new HttpError(409, "VALIDATION_FAILED", { id, approval_status: plan.approval_status });
    }
    const updated = restorationPlanRepository.update(id, { approval_status: "APPROVED" })!;
    console.info(LOG_TEMPLATES.RestorationPlan[4], updated.id, updated.approval_status);
    return updated;
  },

  // A content change to an approved plan invalidates its unstarted schedules.
  change: (id: number, patch: Partial<RestorationPlan>): { plan: RestorationPlan; invalidated: number } => {
    const plan = restorationPlanRepository.findById(id);
    if (!plan) throw new HttpError(404, "VALIDATION_FAILED", { field: "id" });
    const contentChanged =
      typeof patch.method === "string" && patch.method !== plan.method ||
      typeof patch.risk_assessment === "string" && patch.risk_assessment !== plan.risk_assessment ||
      typeof patch.plan_title === "string" && patch.plan_title !== plan.plan_title;
    const nextPatch: Partial<RestorationPlan> = { ...patch };
    if (contentChanged) {
      nextPatch.content_version = plan.content_version + 1;
    }
    const updated = restorationPlanRepository.update(id, nextPatch)!;
    console.info(LOG_TEMPLATES.RestorationPlan[5], updated.id, nextPatch.content_version ?? plan.content_version);
    let invalidated: unknown[] = [];
    if (contentChanged && plan.approval_status === "APPROVED") {
      invalidated = invalidatePlanSchedule(id, "修复方案内容变更，未开始排程失效，请重新排程");
    }
    return { plan: updated, invalidated: invalidated.length };
  }
};

// Helper used by the relic service: locate plans belonging to a relic.
export const invalidateRelicSchedule = (relic: RelicItem) => {
  const plans = restorationPlanRepository
    .findAll()
    .filter((plan) => plan.relic_id === relic.id && plan.approval_status === "APPROVED");
  return plans.flatMap((plan) => invalidatePlanSchedule(plan.id, "文物状态变更，未开始排程失效，请重新排程"));
};
