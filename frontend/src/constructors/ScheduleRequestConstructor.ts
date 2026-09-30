import type { ScheduleRequest, CreateScheduleRequestInput } from "../types/ScheduleRequest";

export const createDefaultScheduleRequest = (overrides: Partial<ScheduleRequest> = {}): ScheduleRequest => ({
  id: 1,
  step_id: 1,
  workstation_id: 1,
  requested_by: 1,
  start_at: "",
  end_at: "",
  status: "PENDING",
  created_at: new Date().toISOString(),
  decided_at: null,
  conflict_reason: null,
  conflict_workstation_id: null,
  occupied_by_request_id: null,
  invalidated_reason: null,
  ...overrides
});

// Form object used by the dispatcher's booking dialog.
export const createScheduleRequestForm = (
  overrides: Partial<CreateScheduleRequestInput> = {}
): CreateScheduleRequestInput => ({
  step_id: 1,
  workstation_id: 1,
  start_at: "",
  end_at: "",
  ...overrides
});

export const createScheduleRequestResponse = createDefaultScheduleRequest;
