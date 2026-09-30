import type { ScheduleApplication } from "../models/ScheduleApplication";
import { ScheduleApplicationStatus } from "../constants/ScheduleApplicationStatus";

const now = Date.now();
const iso = (offsetMs: number): string => new Date(now + offsetMs).toISOString();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const rows: ScheduleApplication[] = [
  {
    id: 1,
    step_id: 1,
    plan_id: 1,
    relic_id: 1,
    workstation_id: 1,
    requested_start: iso(30 * 60 * 1000),
    requested_end: iso(90 * 60 * 1000),
    status: ScheduleApplicationStatus[0],
    attempts: 1,
    last_error_code: "SLOT_OCCUPIED",
    last_error_message: "该时段已被占用",
    occupied_by_name: "调度员 林岚",
    created_by: 1,
    created_at: iso(-30 * 60 * 1000),
    updated_at: iso(-30 * 60 * 1000)
  }
];

export const scheduleApplicationRepository = {
  findAll: (): ScheduleApplication[] => rows,
  findById: (id: number): ScheduleApplication | undefined => rows.find((a) => a.id === id),
  save: (row: ScheduleApplication): ScheduleApplication => {
    rows.push(row);
    return row;
  },
  update: (id: number, patch: Partial<ScheduleApplication>): ScheduleApplication | undefined => {
    const idx = rows.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    rows[idx] = { ...rows[idx], ...patch, id, updated_at: new Date().toISOString() };
    return rows[idx];
  },
  nextId: (): number => rows.reduce((max, a) => Math.max(max, a.id), 0) + 1
};
