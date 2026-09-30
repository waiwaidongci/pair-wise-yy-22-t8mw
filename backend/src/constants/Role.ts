export const Role = ["scheduler", "technician", "expert", "archivist", "guest"] as const;
export type Role = (typeof Role)[number];
export const RoleText: Record<Role, string> = {
  scheduler: "调度员",
  technician: "修复师",
  expert: "专家",
  archivist: "档案员",
  guest: "访客"
};
