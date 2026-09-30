export interface HttpError extends Error {
  status: number;
  code: string;
  extra?: Record<string, unknown>;
}

export function httpError(status: number, code: string, message: string, extra?: Record<string, unknown>): HttpError {
  return Object.assign(new Error(message), { status, code, extra });
}
