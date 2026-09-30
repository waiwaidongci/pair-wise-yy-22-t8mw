export const StepStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "QC_PASSED"] as const;
export type StepStatus = (typeof StepStatus)[number];
