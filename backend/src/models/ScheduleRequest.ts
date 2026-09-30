import type { ScheduleRequestStatus } from "../constants/ScheduleRequestStatus";

export interface ScheduleRequest {
  id: number;
  step_id: number;
  workstation_id: number;
  requested_by: number;
  start_at: string;
  end_at: string;
  status: ScheduleRequestStatus;
  created_at: string;
  decided_at: string | null;
  conflict_reason: string | null;
  conflict_workstation_id: number | null;
  occupied_by_request_id: number | null;
  invalidated_reason: string | null;
}
