export const ScheduleApplicationStatus = ["PENDING", "CONFIRMED", "FAILED"] as const;
export type ScheduleApplicationStatus = (typeof ScheduleApplicationStatus)[number];
export const ScheduleApplicationStatusText: Record<ScheduleApplicationStatus, string> = {
  PENDING: "待处理",
  CONFIRMED: "已确认",
  FAILED: "失败待重试"
};
