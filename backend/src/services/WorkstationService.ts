import { workstationRepository } from "../repositories/WorkstationRepository";
import { createWorkstationDto } from "../constructors/WorkstationDtoFactory";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { Workstation } from "../models/Workstation";

export const workstationService = {
  list: (): Workstation[] => workstationRepository.findAll(),

  create: (payload: Partial<Workstation>): Workstation => {
    const rows = workstationRepository.findAll();
    const dto = createWorkstationDto({
      ...payload,
      id: rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
    });
    console.info(LOG_TEMPLATES.Workstation[0], dto.id);
    return workstationRepository.save(dto);
  }
};
