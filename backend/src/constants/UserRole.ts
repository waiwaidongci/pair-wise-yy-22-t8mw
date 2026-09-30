export const UserRole = ["SCHEDULER", "RESTORER", "EXPERT", "ARCHIVIST", "VIEWER", "ADMIN"] as const;
export type UserRole = (typeof UserRole)[number];
