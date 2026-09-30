const SESSION_KEY = "relic-restore-session";

export interface Session {
  role: string;
  userId: number;
  userName: string;
}

export function getSession(): Session {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Session;
  } catch {
    /* ignore */
  }
  return { role: "guest", userId: 1, userName: "访客" };
}

export function setSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export class ApiError extends Error {
  code?: string;
  extra?: Record<string, unknown>;
  constructor(message: string, code?: string, extra?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.extra = extra;
  }
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const session = getSession();
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  headers.set("x-role", session.role);
  headers.set("x-user-id", String(session.userId));
  if (session.userName) headers.set("x-user-name", encodeURIComponent(session.userName));
  const res = await fetch(url, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new ApiError((data.message as string) ?? "请求失败", data.code as string | undefined, data);
  }
  return data as T;
}
