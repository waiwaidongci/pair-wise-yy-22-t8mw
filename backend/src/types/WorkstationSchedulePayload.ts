export interface ScheduleCreatePayload {
  step_id: number;
  workstation_id: number;
  scheduled_start: string;
  scheduled_end: string;
}

export interface ScheduleRetryPayload {
  workstation_id?: number;
  scheduled_start?: string;
  scheduled_end?: string;
}
