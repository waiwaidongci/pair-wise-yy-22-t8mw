import { create } from "zustand";
import {
  listWorkstation
} from "../api/Workstation";
import type { Workstation } from "../types/Workstation";

type State = {
  rows: Workstation[];
  loading: boolean;
  load: (headers?: HeadersInit) => Promise<void>;
};

export const useWorkstationStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load(headers) {
    set({ loading: true });
    set({ rows: await listWorkstation(headers), loading: false });
  }
}));
