import { create } from "zustand";
import {
  listRestorationPlan,
  approveRestorationPlan,
  changeRestorationPlan
} from "../api/RestorationPlan";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { ApiError } from "../types/ScheduleRequest";

type State = {
  rows: RestorationPlan[];
  loading: boolean;
  message: string | null;
  load: (headers?: HeadersInit) => Promise<void>;
  approve: (id: number, headers?: HeadersInit) => Promise<void>;
  change: (id: number, patch: Partial<RestorationPlan>, headers?: HeadersInit) => Promise<number>;
};

export const useRestorationPlanStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  message: null,

  async load(headers) {
    set({ loading: true });
    set({ rows: await listRestorationPlan(headers), loading: false });
  },

  // Experts still own approval.
  async approve(id, headers) {
    try {
      await approveRestorationPlan(id, headers);
      set({ message: `方案 #${id} 已批准` });
    } catch (error) {
      set({ message: (error as ApiError).message });
    }
    await get().load(headers);
  },

  async change(id, patch, headers) {
    try {
      const result = await changeRestorationPlan(id, patch, headers);
      set({
        message:
          result.invalidated > 0
            ? `方案已变更，${result.invalidated} 条未开始排程失效，请重新排程`
            : "方案已变更"
      });
      await get().load(headers);
      return result.invalidated;
    } catch (error) {
      set({ message: (error as ApiError).message });
      return 0;
    }
  }
}));
