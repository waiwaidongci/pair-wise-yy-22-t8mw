import { apiRequest } from "./request";
import { mockData } from "../mocks/seedData";
import type { RelicItem } from "../types/RelicItem";

const endpoint = "/api/relic-item";

export async function listRelicItem(headers?: HeadersInit): Promise<RelicItem[]> {
  try {
    return await apiRequest<RelicItem[]>(endpoint, { headers });
  } catch {
    return [...(mockData.relicItem as unknown as RelicItem[])];
  }
}

export async function saveRelicItem(payload: RelicItem) {
  console.info("save RelicItem", payload);
  return payload;
}

// A condition change invalidates unstarted schedules of linked plans.
export const updateRelicCondition = (
  id: number,
  current_condition: string,
  headers?: HeadersInit
) =>
  apiRequest<{ relic: RelicItem; invalidated: number }>(`${endpoint}/${id}/condition`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ current_condition })
  });
