import type { ScheduleApplication } from "../types/ScheduleApplication";
import { ScheduleApplicationStatus } from "../constants/ScheduleApplicationStatus";

export const createDefaultScheduleApplication = (overrides: Partial<ScheduleApplication> = {}): ScheduleApplication => ({
  id: 0,
  step_id: 0,
  plan_id: 0,
  relic_id: 0,
  workstation_id: 0,
  requested_start: "",
  requested_end: "",
  status: ScheduleApplicationStatus[0],
  attempts: 0,
  last_error_code: null,
  last_error_message: null,
  occupied_by_name: null,
  created_by: 0,
  created_at: "",
  updated_at: "",
  ...overrides
});

export const createScheduleApplicationForm = createDefaultScheduleApplication;
export const createScheduleApplicationResponse = createDefaultScheduleApplication;
