import type { ScheduleRequest } from "../models/ScheduleRequest";

export const createScheduleRequestDto = (overrides: Partial<ScheduleRequest> = {}): ScheduleRequest => ({
  id: 1,
  step_id: 1,
  workstation_id: 1,
  requested_by: 1,
  start_at: "2026-10-01T09:00:00Z",
  end_at: "2026-10-01T11:00:00Z",
  status: "PENDING",
  created_at: "2026-09-30T09:00:00Z",
  decided_at: null,
  conflict_reason: null,
  conflict_workstation_id: null,
  occupied_by_request_id: null,
  invalidated_reason: null,
  ...overrides
});
