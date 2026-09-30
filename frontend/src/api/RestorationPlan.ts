import { mockData } from "../mocks/seedData";
import { apiFetch } from "./client";
import type { RestorationPlan } from "../types/RestorationPlan";

const endpoint = "/api/restoration-plan";

export interface PlanUpdateResult {
  plan: RestorationPlan;
  invalidation: { invalidated: unknown[]; notice: string };
}

export async function listRestorationPlan(): Promise<RestorationPlan[]> {
  try {
    return await apiFetch<RestorationPlan[]>(endpoint);
  } catch {
    return [...(mockData.restorationPlan as unknown as RestorationPlan[])];
  }
}

export async function saveRestorationPlan(payload: RestorationPlan) {
  console.info("save RestorationPlan", payload);
  return payload;
}

export async function updateRestorationPlan(id: number, patch: Partial<RestorationPlan>): Promise<PlanUpdateResult> {
  return apiFetch<PlanUpdateResult>(`${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}

export async function approveRestorationPlan(id: number): Promise<RestorationPlan> {
  return apiFetch<RestorationPlan>(`${endpoint}/${id}/approve`, { method: "POST" });
}
