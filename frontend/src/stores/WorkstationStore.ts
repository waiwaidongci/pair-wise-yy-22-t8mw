import { create } from "zustand";
import { listWorkstation } from "../api/Workstation";
import type { Workstation } from "../types/Workstation";

interface State {
  rows: Workstation[];
  loading: boolean;
  load: () => Promise<void>;
}

export const useWorkstationStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listWorkstation(), loading: false });
  }
}));
