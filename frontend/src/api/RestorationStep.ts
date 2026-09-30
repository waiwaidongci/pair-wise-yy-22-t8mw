import { apiRequest } from "./request";
import { mockData } from "../mocks/seedData";
import type { RestorationStep } from "../types/RestorationStep";

const endpoint = "/api/restoration-step";

export async function listRestorationStep(headers?: HeadersInit): Promise<RestorationStep[]> {
  try {
    return await apiRequest<RestorationStep[]>(endpoint, { headers });
  } catch {
    return [...(mockData.restorationStep as unknown as RestorationStep[])];
  }
}

export async function saveRestorationStep(payload: RestorationStep) {
  console.info("save RestorationStep", payload);
  return payload;
}

// Repairer starts / completes only the step assigned to them.
export const startRestorationStep = (id: number, headers?: HeadersInit) =>
  apiRequest<RestorationStep>(`${endpoint}/${id}/start`, { method: "POST", headers });

export const completeRestorationStep = (id: number, headers?: HeadersInit) =>
  apiRequest<RestorationStep>(`${endpoint}/${id}/complete`, { method: "POST", headers });
