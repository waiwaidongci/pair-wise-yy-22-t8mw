import { create } from "zustand";
import {
  listScheduleRequest,
  createScheduleRequest,
  retryScheduleRequest
} from "../api/ScheduleRequest";
import type { ScheduleRequest, CreateScheduleRequestInput, ApiError } from "../types/ScheduleRequest";

type State = {
  rows: ScheduleRequest[];
  loading: boolean;
  notice: { type: "success" | "error"; text: string; request?: ScheduleRequest } | null;
  load: (headers?: HeadersInit) => Promise<void>;
  request: (input: CreateScheduleRequestInput, headers?: HeadersInit) => Promise<ScheduleRequest | null>;
  retry: (id: number, headers?: HeadersInit) => Promise<ScheduleRequest | null>;
  clearNotice: () => void;
};

export const useScheduleRequestStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  notice: null,

  async load(headers) {
    set({ loading: true });
    set({ rows: await listScheduleRequest(headers), loading: false });
  },

  async request(input, headers) {
    try {
      const row = await createScheduleRequest(input, headers);
      await get().load(headers);
      set({ notice: { type: "success", text: `申请 #${row.id} 已占位`, request: row } });
      return row;
    } catch (error) {
      const apiError = error as ApiError;
      // 409 keeps the request pending server-side; refresh to expose it.
      await get().load(headers);
      const kept = get().rows.find((row) => row.id === (apiError.details?.request as ScheduleRequest | undefined)?.id);
      set({
        notice: {
          type: "error",
          text: kept?.conflict_reason ?? apiError.message,
          request: kept
        }
      });
      return null;
    }
  },

  async retry(id, headers) {
    try {
      const row = await retryScheduleRequest(id, headers);
      await get().load(headers);
      set({ notice: { type: "success", text: `申请 #${row.id} 重试成功，已占位`, request: row } });
      return row;
    } catch (error) {
      const apiError = error as ApiError;
      await get().load(headers);
      const kept = get().rows.find((row) => row.id === id);
      set({
        notice: {
          type: "error",
          text: kept?.invalidated_reason ?? kept?.conflict_reason ?? apiError.message,
          request: kept
        }
      });
      return null;
    }
  },

  clearNotice: () => set({ notice: null })
}));
