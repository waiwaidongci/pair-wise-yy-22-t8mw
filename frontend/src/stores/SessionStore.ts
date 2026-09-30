import { create } from "zustand";
import type { UserRole } from "../constants/UserRole";

// Current operator identity. Sent as x-role / x-user-id headers; the backend
// treats them as the dev shim for JWT + RBAC and gates every write action.
type SessionState = {
  role: UserRole;
  userId: number;
  setRole: (role: UserRole) => void;
  setUserId: (userId: number) => void;
  headers: () => HeadersInit;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  role: "SCHEDULER",
  userId: 1,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
  headers: () => ({ "x-role": get().role, "x-user-id": String(get().userId) })
}));
