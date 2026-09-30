export const StepStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "QC_PASSED"] as const;
export type StepStatus = (typeof StepStatus)[number];
export const StepStatusText: Record<StepStatus, string> = {
  PENDING: "待开始",
  IN_PROGRESS: "进行中",
  COMPLETED: "已完成",
  QC_PASSED: "质检通过"
};
