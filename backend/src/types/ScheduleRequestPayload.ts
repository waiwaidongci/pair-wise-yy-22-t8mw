export interface CreateScheduleRequestPayload {
  step_id: number;
  workstation_id: number;
  start_at: string;
  end_at: string;
}

export type ScheduleRequestPayload = Record<string, unknown>;
