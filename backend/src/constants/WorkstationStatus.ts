export const WorkstationStatus = ["ACTIVE", "MAINTENANCE", "CLOSED"] as const;
export type WorkstationStatus = (typeof WorkstationStatus)[number];
export const WorkstationStatusText: Record<WorkstationStatus, string> = {
  ACTIVE: "可用",
  MAINTENANCE: "维护中",
  CLOSED: "已关闭"
};
