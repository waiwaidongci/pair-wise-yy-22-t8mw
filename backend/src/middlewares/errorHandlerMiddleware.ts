import type { ErrorRequestHandler } from "express";

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  const body: Record<string, unknown> = { code: err.code ?? "INTERNAL_ERROR", message: err.message };
  if (err.extra && typeof err.extra === "object") {
    Object.assign(body, err.extra);
  }
  res.status(status).json(body);
};
