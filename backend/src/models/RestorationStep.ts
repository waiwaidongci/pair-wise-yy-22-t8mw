import type { StepStatus } from "../constants/StepStatus";

export interface RestorationStep {
  id: number;
  plan_id: number;
  step_order: string;
  technique: string;
  material_used: string;
  operator_id: number;
  step_status: StepStatus;
  finished_at: string | null;
  scheduled_workstation_id: number | null;
  scheduled_start_at: string | null;
  scheduled_end_at: string | null;
}
