import type { Workstation } from "../types/Workstation";
import { WorkstationStatus } from "../constants/WorkstationStatus";

export const createDefaultWorkstation = (overrides: Partial<Workstation> = {}): Workstation => ({
  id: 0,
  code: "",
  name: "",
  capacity: 1,
  window_start: "09:00",
  window_end: "18:00",
  status: WorkstationStatus[0],
  location: "",
  ...overrides
});

export const createWorkstationForm = createDefaultWorkstation;
export const createWorkstationResponse = createDefaultWorkstation;
