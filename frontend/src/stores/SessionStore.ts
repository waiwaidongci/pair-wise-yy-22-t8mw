import { create } from "zustand";
import { getSession, setSession, type Session } from "../api/client";

interface State {
  session: Session;
  setRole: (role: string, userName: string, userId?: number) => void;
}

const ROLE_PRESETS: Record<string, { userName: string; userId: number }> = {
  scheduler: { userName: "调度员 林岚", userId: 1 },
  technician: { userName: "修复师 陈实", userId: 2 },
  expert: { userName: "专家 顾教授", userId: 4 },
  archivist: { userName: "档案员 小温", userId: 5 },
  guest: { userName: "访客", userId: 99 }
};

export const useSessionStore = create<State>((set) => ({
  session: getSession(),
  setRole: (role, userName, userId) => {
    const preset = ROLE_PRESETS[role] ?? ROLE_PRESETS.guest;
    const session: Session = { role, userName: userName || preset.userName, userId: userId ?? preset.userId };
    setSession(session);
    set({ session });
  }
}));

export { ROLE_PRESETS };
