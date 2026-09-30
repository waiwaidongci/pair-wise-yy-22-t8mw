export const ScheduleRequestStatus = ["PENDING", "CONFIRMED", "INVALIDATED"] as const;
export type ScheduleRequestStatus = (typeof ScheduleRequestStatus)[number];
