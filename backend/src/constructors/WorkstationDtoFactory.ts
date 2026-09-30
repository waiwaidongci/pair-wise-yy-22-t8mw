import type { Workstation } from "../models/Workstation";
import { WorkstationStatus } from "../constants/WorkstationStatus";

export const createWorkstationDto = (overrides: Partial<Workstation> = {}): Workstation => ({
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

export const createWorkstationFormDto = createWorkstationDto;
export const createWorkstationResponseDto = createWorkstationDto;
