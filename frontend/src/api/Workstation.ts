import { apiFetch } from "./client";
import type { Workstation } from "../types/Workstation";
import { mockData } from "../mocks/seedData";

const endpoint = "/api/workstation";

export async function listWorkstation(): Promise<Workstation[]> {
  try {
    return await apiFetch<Workstation[]>(endpoint);
  } catch {
    return [...(mockData.workstation as unknown as Workstation[])];
  }
}

export async function createWorkstation(payload: Partial<Workstation>): Promise<Workstation> {
  return apiFetch<Workstation>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateWorkstation(id: number, payload: Partial<Workstation>): Promise<Workstation> {
  return apiFetch<Workstation>(`${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}
