import type { RequestHandler } from "express";
import type { UserRole } from "../constants/UserRole";
import { HttpError } from "../utils/httpError";

// Route-level RBAC. The request user is populated by authMiddleware from the
// x-role / x-user-id headers (JWT in production); ADMIN is a universal role.
export const rbacMiddleware = (roles: UserRole[] = []): RequestHandler => (req, _res, next) => {
  const user = (req as unknown as { user?: { id: number; role: UserRole } }).user;
  if (!user) return next(new HttpError(401, "AUTH_REQUIRED"));
  if (roles.length > 0 && !roles.includes(user.role) && user.role !== "ADMIN") {
    return next(new HttpError(403, "RBAC_DENIED", { required: roles, actual: user.role }));
  }
  next();
};
