import { seed } from "../seed";
import type { ScheduleRequest } from "../models/ScheduleRequest";
import type { ScheduleRequestStatus } from "../constants/ScheduleRequestStatus";

const rows: ScheduleRequest[] = seed.scheduleRequest.map((row) => ({ ...row })) as ScheduleRequest[];

export const scheduleRequestRepository = {
  findAll: (): ScheduleRequest[] => rows,
  findById: (id: number): ScheduleRequest | undefined => rows.find((row) => row.id === id),
  findByStepId: (stepId: number): ScheduleRequest[] => rows.filter((row) => row.step_id === stepId),
  findConfirmedForWorkstation: (workstationId: number): ScheduleRequest[] =>
    rows.filter((row) => row.workstation_id === workstationId && row.status === "CONFIRMED"),
  save: (row: ScheduleRequest): ScheduleRequest => {
    rows.push(row);
    return row;
  },
  update: (id: number, patch: Partial<ScheduleRequest>): ScheduleRequest | undefined => {
    const row = rows.find((request) => request.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  },
  invalidateForPlan: (
    planId: number,
    stepIds: number[],
    reason: string
  ): ScheduleRequest[] => {
    const targets = rows.filter(
      (row) =>
        stepIds.includes(row.step_id) &&
        (row.status === ("PENDING" as ScheduleRequestStatus) || row.status === ("CONFIRMED" as ScheduleRequestStatus))
    );
    targets.forEach((row) =>
      Object.assign(row, {
        status: "INVALIDATED" as ScheduleRequestStatus,
        invalidated_reason: reason,
        conflict_reason: null,
        occupied_by_request_id: null,
        decided_at: new Date().toISOString()
      })
    );
    return targets;
  }
};
