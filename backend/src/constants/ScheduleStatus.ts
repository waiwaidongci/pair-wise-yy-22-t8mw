export const ScheduleStatus = ["SCHEDULED", "INVALID", "COMPLETED", "CANCELLED"] as const;
export type ScheduleStatus = (typeof ScheduleStatus)[number];
export const ScheduleStatusText: Record<ScheduleStatus, string> = {
  SCHEDULED: "已排程",
  INVALID: "已失效",
  COMPLETED: "已完成",
  CANCELLED: "已取消"
};
