import { create } from "zustand";
import {
  listSchedules,
  listApplications,
  createSchedule,
  retryApplication,
  type ScheduleResult
} from "../api/Schedule";
import type { WorkstationSchedule, OccupantInfo } from "../types/WorkstationSchedule";
import type { ScheduleApplication } from "../types/ScheduleApplication";
import { ApiError } from "../api/client";

interface State {
  schedules: WorkstationSchedule[];
  applications: ScheduleApplication[];
  loading: boolean;
  error: string | null;
  occupant: OccupantInfo | null;
  lastNotice: string | null;
  load: () => Promise<void>;
  scheduleStep: (payload: {
    step_id: number;
    workstation_id: number;
    scheduled_start: string;
    scheduled_end: string;
  }) => Promise<ScheduleResult | null>;
  retry: (
    id: number,
    overrides?: { workstation_id?: number; scheduled_start?: string; scheduled_end?: string }
  ) => Promise<ScheduleResult | null>;
  clearNotices: () => void;
}

export const useScheduleStore = create<State>((set, get) => ({
  schedules: [],
  applications: [],
  loading: false,
  error: null,
  occupant: null,
  lastNotice: null,

  async load() {
    set({ loading: true, error: null });
    const [schedules, applications] = await Promise.all([listSchedules(), listApplications()]);
    set({ schedules, applications, loading: false });
  },

  async scheduleStep(payload) {
    set({ loading: true, error: null, occupant: null });
    try {
      const result = await createSchedule(payload);
      set({ loading: false, lastNotice: null });
      await get().load();
      return result;
    } catch (e) {
      const err = e as ApiError;
      const occupant = (err.extra?.occupiedBy as OccupantInfo) ?? null;
      set({ loading: false, error: err.message, occupant });
      await get().load();
      return null;
    }
  },

  async retry(id, overrides = {}) {
    set({ loading: true, error: null, occupant: null });
    try {
      const result = await retryApplication(id, overrides);
      set({ loading: false });
      await get().load();
      return result;
    } catch (e) {
      const err = e as ApiError;
      const occupant = (err.extra?.occupiedBy as OccupantInfo) ?? null;
      set({ loading: false, error: err.message, occupant });
      await get().load();
      return null;
    }
  },

  clearNotices() {
    set({ error: null, occupant: null, lastNotice: null });
  }
}));
