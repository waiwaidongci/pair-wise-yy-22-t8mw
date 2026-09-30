import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { ApiError } from "../types/ScheduleRequest";

// Shared request wrapper: turns non-2xx responses into typed ApiErrors so the
// UI can show occupancy / invalidation notes and decide whether retry is valid.
export async function apiRequest<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error: ApiError = {
      code: body?.code ?? "VALIDATION_FAILED",
      message: (ERROR_MESSAGES as Record<string, string>)[body?.code] ?? body?.message ?? "请求失败",
      details: body?.details
    };
    throw error;
  }
  return body as T;
}
