import { seed } from "../seed";
import type { Workstation } from "../models/Workstation";

const rows: Workstation[] = seed.workstation.map((row) => ({ ...row })) as Workstation[];

export const workstationRepository = {
  findAll: (): Workstation[] => rows.filter((row) => row.active),
  findById: (id: number): Workstation | undefined => rows.find((row) => row.id === id),
  save: (row: Workstation): Workstation => {
    rows.push(row);
    return row;
  }
};
