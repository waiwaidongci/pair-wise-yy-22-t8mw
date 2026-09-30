import type { Workstation } from "../models/Workstation";

export const createWorkstationDto = (overrides: Partial<Workstation> = {}): Workstation => ({
  id: 1,
  code: "WS-01",
  name: "青铜修复工位",
  capacity: 2,
  open_from: "09:00",
  open_until: "18:00",
  active: true,
  ...overrides
});
