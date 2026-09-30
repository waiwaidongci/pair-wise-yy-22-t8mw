import type { RestorationStep } from "../types/RestorationStep";

export const createDefaultRestorationStep = (overrides: Partial<RestorationStep> = {}): RestorationStep => ({
  id: 1,
  plan_id: 1,
  step_order: "1",
  technique: "待拆解工序",
  material_used: "",
  operator_id: 1,
  step_status: "PENDING",
  finished_at: null,
  scheduled_workstation_id: null,
  scheduled_start_at: null,
  scheduled_end_at: null,
  ...overrides
});

export const createRestorationStepForm = createDefaultRestorationStep;
export const createRestorationStepResponse = createDefaultRestorationStep;
