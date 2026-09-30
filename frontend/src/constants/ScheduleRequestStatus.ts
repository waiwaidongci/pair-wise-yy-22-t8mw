export const ScheduleRequestStatus = ["PENDING", "CONFIRMED", "INVALIDATED"] as const;
export type ScheduleRequestStatus = (typeof ScheduleRequestStatus)[number];
export const ScheduleRequestStatusText: Record<ScheduleRequestStatus, string> = {
  PENDING: "待处理",
  CONFIRMED: "已占位",
  INVALIDATED: "已失效"
};
