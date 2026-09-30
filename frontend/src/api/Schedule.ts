import { apiFetch } from "./client";
import type { WorkstationSchedule } from "../types/WorkstationSchedule";
import type { ScheduleApplication } from "../types/ScheduleApplication";
import { mockData } from "../mocks/seedData";

const base = "/api/schedule";

export interface ScheduleResult {
  schedule: WorkstationSchedule;
  application: ScheduleApplication;
}

export async function listSchedules(): Promise<WorkstationSchedule[]> {
  try {
    return await apiFetch<WorkstationSchedule[]>(`${base}/schedules`);
  } catch {
    return [...(mockData.workstationSchedule as unknown as WorkstationSchedule[])];
  }
}

export async function listApplications(): Promise<ScheduleApplication[]> {
  try {
    return await apiFetch<ScheduleApplication[]>(`${base}/applications`);
  } catch {
    return [...(mockData.scheduleApplication as unknown as ScheduleApplication[])];
  }
}

export async function createSchedule(payload: {
  step_id: number;
  workstation_id: number;
  scheduled_start: string;
  scheduled_end: string;
}): Promise<ScheduleResult> {
  return apiFetch<ScheduleResult>(`${base}/schedules`, { method: "POST", body: JSON.stringify(payload) });
}

export async function retryApplication(
  id: number,
  overrides: { workstation_id?: number; scheduled_start?: string; scheduled_end?: string } = {}
): Promise<ScheduleResult> {
  return apiFetch<ScheduleResult>(`${base}/applications/${id}/retry`, {
    method: "POST",
    body: JSON.stringify(overrides)
  });
}
