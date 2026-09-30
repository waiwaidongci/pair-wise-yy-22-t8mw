export interface ScheduleApplication {
  id: number;
  step_id: number;
  plan_id: number;
  relic_id: number;
  workstation_id: number;
  requested_start: string;
  requested_end: string;
  status: string;
  attempts: number;
  last_error_code: string | null;
  last_error_message: string | null;
  occupied_by_name: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}
