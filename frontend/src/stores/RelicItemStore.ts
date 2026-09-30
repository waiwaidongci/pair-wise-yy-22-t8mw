import { create } from "zustand";
import { listRelicItem, updateRelicCondition } from "../api/RelicItem";
import type { RelicItem } from "../types/RelicItem";
import type { ApiError } from "../types/ScheduleRequest";

type State = {
  rows: RelicItem[];
  loading: boolean;
  message: string | null;
  load: (headers?: HeadersInit) => Promise<void>;
  updateCondition: (id: number, condition: string, headers?: HeadersInit) => Promise<number>;
};

export const useRelicItemStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  message: null,
  async load(headers) {
    set({ loading: true });
    set({ rows: await listRelicItem(headers), loading: false });
  },
  async updateCondition(id, condition, headers) {
    try {
      const result = await updateRelicCondition(id, condition, headers);
      set({
        message:
          result.invalidated > 0
            ? `文物状态已变更，${result.invalidated} 条未开始排程失效，请重新排程`
            : "文物状态已变更"
      });
      await get().load(headers);
      return result.invalidated;
    } catch (error) {
      set({ message: (error as ApiError).message });
      return 0;
    }
  }
}));
