import type { RequestHandler } from "express";
import type { UserRole } from "../constants/UserRole";
import { UserRole as roles } from "../constants/UserRole";

// Dev/review shim for JWT verification: identity comes from headers. A real
// deployment verifies the bearer token here.
export const authMiddleware: RequestHandler = (req, _res, next) => {
  const headerRole = req.header("x-role") as UserRole | undefined;
  const role = headerRole && (roles as readonly string[]).includes(headerRole) ? headerRole : "ADMIN";
  const id = Number(req.header("x-user-id") ?? 1);
  (req as unknown as { user: { id: number; role: UserRole } }).user = { id: Number.isFinite(id) ? id : 1, role };
  next();
};
