import { apiRequest } from "./request";
import { mockData } from "../mocks/seedData";
import type { ScheduleRequest, CreateScheduleRequestInput, ApiError } from "../types/ScheduleRequest";

const endpoint = "/api/schedule-request";

export async function listScheduleRequest(headers?: HeadersInit): Promise<ScheduleRequest[]> {
  try {
    return await apiRequest<ScheduleRequest[]>(endpoint, { headers });
  } catch {
    return [...(mockData.scheduleRequest as unknown as ScheduleRequest[])];
  }
}

export async function createScheduleRequest(
  input: CreateScheduleRequestInput,
  headers?: HeadersInit
): Promise<ScheduleRequest> {
  return apiRequest<ScheduleRequest>(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(input)
  });
}

// Retry keeps the original pending application; returns the confirmed request
// or throws the occupancy / invalidation error for the UI to surface.
export async function retryScheduleRequest(id: number, headers?: HeadersInit): Promise<ScheduleRequest> {
  return apiRequest<ScheduleRequest>(`${endpoint}/${id}/retry`, { method: "POST", headers });
}

export const isRetriable = (error: ApiError): boolean =>
  error.code === "SCHEDULE_SLOT_OCCUPIED" ||
  error.code === "SCHEDULE_OUTSIDE_WINDOW" ||
  error.code === "SCHEDULE_WRITE_FAILED";
