import type { RequestHandler } from "express";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const role = (req.header("x-role") ?? "guest").toLowerCase();
  const id = Number(req.header("x-user-id") ?? 1);
  const name = req.header("x-user-name") ?? undefined;
  (req as any).user = { id: Number.isFinite(id) ? id : 1, role, name };
  next();
};
