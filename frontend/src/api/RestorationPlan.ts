import { apiRequest } from "./request";
import { mockData } from "../mocks/seedData";
import type { RestorationPlan } from "../types/RestorationPlan";

const endpoint = "/api/restoration-plan";

export async function listRestorationPlan(headers?: HeadersInit): Promise<RestorationPlan[]> {
  try {
    return await apiRequest<RestorationPlan[]>(endpoint, { headers });
  } catch {
    return [...(mockData.restorationPlan as unknown as RestorationPlan[])];
  }
}

export async function saveRestorationPlan(payload: RestorationPlan) {
  console.info("save RestorationPlan", payload);
  return payload;
}

// Experts approve plans.
export const approveRestorationPlan = (id: number, headers?: HeadersInit) =>
  apiRequest<RestorationPlan>(`${endpoint}/${id}/approve`, { method: "POST", headers });

// A content change invalidates not-yet-started schedules.
export const changeRestorationPlan = (
  id: number,
  patch: Partial<RestorationPlan>,
  headers?: HeadersInit
) =>
  apiRequest<{ plan: RestorationPlan; invalidated: number }>(`${endpoint}/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(patch)
  });
