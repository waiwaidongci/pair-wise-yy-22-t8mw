import { mockData } from "../mocks/seedData";
import { apiFetch } from "./client";
import type { RestorationStep } from "../types/RestorationStep";

const endpoint = "/api/restoration-step";

export async function listRestorationStep(): Promise<RestorationStep[]> {
  try {
    return await apiFetch<RestorationStep[]>(endpoint);
  } catch {
    return [...(mockData.restorationStep as unknown as RestorationStep[])];
  }
}

export async function saveRestorationStep(payload: RestorationStep) {
  console.info("save RestorationStep", payload);
  return payload;
}

export interface StepTransitionResult {
  step: RestorationStep;
  schedule?: WorkstationScheduleLike;
}
type WorkstationScheduleLike = { id: number; scheduled_start: string; scheduled_end: string; status: string };

export async function transitionStep(stepId: number, action: "start" | "complete"): Promise<StepTransitionResult> {
  return apiFetch<StepTransitionResult>(`${endpoint}/${stepId}/${action}`, { method: "POST" });
}
