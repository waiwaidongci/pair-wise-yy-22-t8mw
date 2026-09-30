import type { Workstation } from "../types/Workstation";

export const createDefaultWorkstation = (overrides: Partial<Workstation> = {}): Workstation => ({
  id: 1,
  code: "WS-01",
  name: "新建工位",
  capacity: 1,
  open_from: "09:00",
  open_until: "18:00",
  active: true,
  ...overrides
});

export const createWorkstationForm = createDefaultWorkstation;
export const createWorkstationResponse = createDefaultWorkstation;
