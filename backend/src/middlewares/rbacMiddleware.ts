import type { RequestHandler } from "express";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const rbacMiddleware = (allowedRoles: string[] = []): RequestHandler => (req, res, next) => {
  const user = (req as any).user;
  if (!user || !user.role) {
    return res.status(401).json({ code: ERROR_CODES.AUTH_REQUIRED, message: ERROR_MESSAGES.AUTH_REQUIRED });
  }
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return res.status(403).json({ code: ERROR_CODES.RBAC_DENIED, message: ERROR_MESSAGES.RBAC_DENIED });
  }
  next();
};
