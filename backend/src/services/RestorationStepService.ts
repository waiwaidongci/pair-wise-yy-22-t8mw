import { restorationStepRepository } from "../repositories/RestorationStepRepository";
import { HttpError } from "../utils/httpError";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RestorationStep } from "../models/RestorationStep";
import type { StepStatus } from "../constants/StepStatus";

const assertAssigned = (step: RestorationStep, actorId: number, action: string) => {
  if (step.operator_id !== actorId) {
    throw new HttpError(403, "STEP_NOT_ASSIGNED", { step_id: step.id, operator_id: step.operator_id, action });
  }
};

const transition = (id: number, allowed: StepStatus[], next: StepStatus, actorId: number, log: string, patch: Partial<RestorationStep> = {}) => {
  const step = restorationStepRepository.findById(id);
  if (!step) throw new HttpError(404, "VALIDATION_FAILED", { field: "step_id" });
  assertAssigned(step, actorId, log);
  if (!allowed.includes(step.step_status)) {
    throw new HttpError(409, "VALIDATION_FAILED", { step_id: id, from: step.step_status, to: next });
  }
  const updated = restorationStepRepository.update(id, { ...patch, step_status: next })!;
  console.info(log, updated.id, updated.step_status);
  return updated;
};

export const restorationStepService = {
  list: (): RestorationStep[] => restorationStepRepository.findAll(),

  // Repairers only see the steps assigned to them.
  listForOperator: (operatorId: number): RestorationStep[] =>
    restorationStepRepository.findAll().filter((step) => step.operator_id === operatorId),

  create: (row: unknown): unknown => restorationStepRepository.save(row as RestorationStep),

  // Only the assigned repairer can start the step; scheduling alone never
  // moves a step into IN_PROGRESS.
  start: (id: number, actorId: number): RestorationStep =>
    transition(id, ["PENDING"], "IN_PROGRESS", actorId, LOG_TEMPLATES.RestorationStep[5]),

  complete: (id: number, actorId: number): RestorationStep =>
    transition(
      id,
      ["IN_PROGRESS"],
      "COMPLETED",
      actorId,
      LOG_TEMPLATES.RestorationStep[6],
      { finished_at: new Date().toISOString() }
    )
};
