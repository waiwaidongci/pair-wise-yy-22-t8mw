export const UserRole = ["SCHEDULER", "RESTORER", "EXPERT", "ARCHIVIST", "VIEWER", "ADMIN"] as const;
export type UserRole = (typeof UserRole)[number];
export const UserRoleText: Record<UserRole, string> = {
  SCHEDULER: "调度员",
  RESTORER: "修复师",
  EXPERT: "专家",
  ARCHIVIST: "档案员",
  VIEWER: "访客",
  ADMIN: "管理员"
};
