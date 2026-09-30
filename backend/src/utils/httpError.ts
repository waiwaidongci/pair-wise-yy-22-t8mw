import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { ErrorCode } from "../constants/errorCodes";

export class HttpError extends Error {
  status: number;
  code: ErrorCode;
  details?: Record<string, unknown>;

  constructor(status: number, code: ErrorCode, details?: Record<string, unknown>) {
    super(ERROR_MESSAGES[code]);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
