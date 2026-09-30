import { create } from "zustand";
import {
  listRestorationStep,
  startRestorationStep,
  completeRestorationStep
} from "../api/RestorationStep";
import type { RestorationStep } from "../types/RestorationStep";
import type { ApiError } from "../types/ScheduleRequest";

type State = {
  rows: RestorationStep[];
  loading: boolean;
  message: string | null;
  load: (headers?: HeadersInit) => Promise<void>;
  start: (id: number, headers?: HeadersInit) => Promise<void>;
  complete: (id: number, headers?: HeadersInit) => Promise<void>;
};

export const useRestorationStepStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  message: null,

  async load(headers) {
    set({ loading: true });
    set({ rows: await listRestorationStep(headers), loading: false });
  },

  // Starting is a distinct restorer action — scheduling never flips status.
  async start(id, headers) {
    try {
      await startRestorationStep(id, headers);
      set({ message: `步骤 #${id} 已开始` });
    } catch (error) {
      set({ message: (error as ApiError).message });
    }
    await get().load(headers);
  },

  async complete(id, headers) {
    try {
      await completeRestorationStep(id, headers);
      set({ message: `步骤 #${id} 已完成` });
    } catch (error) {
      set({ message: (error as ApiError).message });
    }
    await get().load(headers);
  }
}));
