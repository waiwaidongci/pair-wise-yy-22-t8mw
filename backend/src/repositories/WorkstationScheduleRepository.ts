import type { WorkstationSchedule } from "../models/WorkstationSchedule";
import { ScheduleStatus } from "../constants/ScheduleStatus";

// 排程种子使用相对当前时间的时间窗，保证「未开始 / 进行中」语义可演示
const now = Date.now();
const iso = (offsetMs: number): string => new Date(now + offsetMs).toISOString();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const rows: WorkstationSchedule[] = [
  {
    id: 1,
    step_id: 2,
    plan_id: 2,
    relic_id: 2,
    workstation_id: 1,
    scheduled_start: iso(-HOUR),
    scheduled_end: iso(HOUR),
    status: ScheduleStatus[0],
    occupied_by: 1,
    occupied_by_name: "调度员 林岚",
    occupied_at: iso(-2 * HOUR),
    version: 1,
    invalid_reason: null,
    created_at: iso(-2 * HOUR)
  },
  {
    id: 2,
    step_id: 3,
    plan_id: 3,
    relic_id: 3,
    workstation_id: 2,
    scheduled_start: iso(DAY),
    scheduled_end: iso(DAY + 2 * HOUR),
    status: ScheduleStatus[0],
    occupied_by: 1,
    occupied_by_name: "调度员 林岚",
    occupied_at: iso(-HOUR),
    version: 1,
    invalid_reason: null,
    created_at: iso(-HOUR)
  }
];

export interface OccupantInfo {
  schedule_id: number;
  step_id: number;
  occupied_by: number;
  occupied_by_name: string;
  occupied_at: string;
  scheduled_start: string;
  scheduled_end: string;
}

export interface OccupyResult {
  ok: boolean;
  schedule?: WorkstationSchedule;
  occupiedBy?: OccupantInfo;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart).getTime() < new Date(bEnd).getTime() && new Date(bStart).getTime() < new Date(aEnd).getTime();
}

function toOccupant(s: WorkstationSchedule): OccupantInfo {
  return {
    schedule_id: s.id,
    step_id: s.step_id,
    occupied_by: s.occupied_by,
    occupied_by_name: s.occupied_by_name,
    occupied_at: s.occupied_at,
    scheduled_start: s.scheduled_start,
    scheduled_end: s.scheduled_end
  };
}

export const workstationScheduleRepository = {
  findAll: (): WorkstationSchedule[] => rows,
  findById: (id: number): WorkstationSchedule | undefined => rows.find((s) => s.id === id),
  findByStep: (stepId: number): WorkstationSchedule[] => rows.filter((s) => s.step_id === stepId),
  findValidByStep: (stepId: number): WorkstationSchedule[] =>
    rows.filter((s) => s.step_id === stepId && s.status === ScheduleStatus[0]),
  /**
   * 原子占位：在同一工位上加容量校验并条件写入。
   * Node 单线程事件循环下，同步的「检查重叠 + 插入」不会被打断，
   * 因此先进入临界区的请求先占位，后到者只能拿到占用说明。
   * 返回 occupiedBy 供上层拼装「后到者收到的占用说明」。
   */
  occupySlot: (candidate: WorkstationSchedule, capacity: number): OccupyResult => {
    const overlapping = rows.filter(
      (s) =>
        s.workstation_id === candidate.workstation_id &&
        s.status === ScheduleStatus[0] &&
        overlaps(s.scheduled_start, s.scheduled_end, candidate.scheduled_start, candidate.scheduled_end)
    );
    if (overlapping.length >= capacity) {
      return { ok: false, occupiedBy: toOccupant(overlapping[0]) };
    }
    rows.push(candidate);
    return { ok: true, schedule: candidate };
  },
  update: (id: number, patch: Partial<WorkstationSchedule>): WorkstationSchedule | undefined => {
    const idx = rows.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    rows[idx] = { ...rows[idx], ...patch, id };
    return rows[idx];
  },
  nextId: (): number => rows.reduce((max, s) => Math.max(max, s.id), 0) + 1
};
