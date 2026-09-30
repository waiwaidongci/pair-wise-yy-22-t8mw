export interface WorkstationSchedule {
  id: number;
  step_id: number;
  plan_id: number;
  relic_id: number;
  workstation_id: number;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  occupied_by: number;
  occupied_by_name: string;
  occupied_at: string;
  version: number;
  invalid_reason: string | null;
  created_at: string;
}
