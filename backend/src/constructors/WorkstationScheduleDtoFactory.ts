import type { WorkstationSchedule } from "../models/WorkstationSchedule";
import { ScheduleStatus } from "../constants/ScheduleStatus";

export const createWorkstationScheduleDto = (overrides: Partial<WorkstationSchedule> = {}): WorkstationSchedule => ({
  id: 0,
  step_id: 0,
  plan_id: 0,
  relic_id: 0,
  workstation_id: 0,
  scheduled_start: "",
  scheduled_end: "",
  status: ScheduleStatus[0],
  occupied_by: 0,
  occupied_by_name: "",
  occupied_at: "",
  version: 1,
  invalid_reason: null,
  created_at: "",
  ...overrides
});
