import { apiRequest } from "./request";
import { mockData } from "../mocks/seedData";
import type { Workstation } from "../types/Workstation";

const endpoint = "/api/workstation";

export async function listWorkstation(roleHeaders?: HeadersInit): Promise<Workstation[]> {
  try {
    return await apiRequest<Workstation[]>(endpoint, { headers: roleHeaders });
  } catch {
    return [...(mockData.workstation as unknown as Workstation[])];
  }
}
