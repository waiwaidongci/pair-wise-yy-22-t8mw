import { workstationRepository } from "../repositories/WorkstationRepository";
import { createWorkstationDto } from "../constructors/WorkstationDtoFactory";
import { WorkstationStatus } from "../constants/WorkstationStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { httpError } from "../utils/httpError";

export const workstationService = {
  list: () => workstationRepository.findAll(),
  get: (id: number) => {
    const ws = workstationRepository.findById(id);
    if (!ws) throw httpError(404, ERROR_CODES.WORKSTATION_NOT_FOUND, ERROR_MESSAGES.WORKSTATION_NOT_FOUND);
    return ws;
  },
  create: (payload: Record<string, unknown>) => {
    const dto = createWorkstationDto({ ...payload, id: workstationRepository.nextId() } as never);
    return workstationRepository.save(dto);
  },
  update: (id: number, payload: Record<string, unknown>) => {
    const existing = workstationRepository.findById(id);
    if (!existing) throw httpError(404, ERROR_CODES.WORKSTATION_NOT_FOUND, ERROR_MESSAGES.WORKSTATION_NOT_FOUND);
    const next = workstationRepository.update(id, payload as never);
    return next;
  },
  assertUsable: (id: number) => {
    const ws = workstationRepository.findById(id);
    if (!ws) throw httpError(404, ERROR_CODES.WORKSTATION_NOT_FOUND, ERROR_MESSAGES.WORKSTATION_NOT_FOUND);
    if (ws.status !== WorkstationStatus[0]) {
      throw httpError(409, ERROR_CODES.WORKSTATION_CLOSED, ERROR_MESSAGES.WORKSTATION_CLOSED);
    }
    return ws;
  }
};
