export const StepStatus = ["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED"] as const;
export type StepStatus = (typeof StepStatus)[number];
export const StepStatusText: Record<StepStatus, string> = {
  PENDING: "待排程",
  SCHEDULED: "已排程",
  IN_PROGRESS: "进行中",
  COMPLETED: "已完成"
};
