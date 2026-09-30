import { mockData } from "../mocks/seedData";
import { apiFetch } from "./client";
import type { RelicItem } from "../types/RelicItem";

const endpoint = "/api/relic-item";

export interface RelicUpdateResult {
  relic: RelicItem;
  invalidation: { invalidated: unknown[]; notice: string };
}

export async function listRelicItem(): Promise<RelicItem[]> {
  try {
    return await apiFetch<RelicItem[]>(endpoint);
  } catch {
    return [...(mockData.relicItem as unknown as RelicItem[])];
  }
}

export async function saveRelicItem(payload: RelicItem) {
  console.info("save RelicItem", payload);
  return payload;
}

export async function updateRelicItem(id: number, patch: Partial<RelicItem>): Promise<RelicUpdateResult> {
  return apiFetch<RelicUpdateResult>(`${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}
