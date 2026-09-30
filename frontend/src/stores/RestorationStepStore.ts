import { create } from "zustand";
import { listRestorationStep, transitionStep } from "../api/RestorationStep";
import type { RestorationStep } from "../types/RestorationStep";
import { ApiError } from "../api/client";

interface State {
  rows: RestorationStep[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  transition: (stepId: number, action: "start" | "complete") => Promise<boolean>;
  clearError: () => void;
}

export const useRestorationStepStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });
    set({ rows: await listRestorationStep(), loading: false });
  },
  async transition(stepId, action) {
    set({ loading: true, error: null });
    try {
      const result = await transitionStep(stepId, action);
      set({
        rows: get().rows.map((r) => (r.id === stepId ? { ...r, ...result.step } : r)),
        loading: false
      });
      return true;
    } catch (e) {
      set({ loading: false, error: (e as ApiError).message });
      return false;
    }
  },
  clearError() {
    set({ error: null });
  }
}));
