import { seed } from "../seed";
import type { Workstation } from "../models/Workstation";

const rows: Workstation[] = (seed.workstation as readonly Workstation[]).map((w) => ({ ...w }));

export const workstationRepository = {
  findAll: (): Workstation[] => rows,
  findById: (id: number): Workstation | undefined => rows.find((w) => w.id === id),
  save: (row: Workstation): Workstation => {
    rows.push(row);
    return row;
  },
  update: (id: number, patch: Partial<Workstation>): Workstation | undefined => {
    const idx = rows.findIndex((w) => w.id === id);
    if (idx === -1) return undefined;
    rows[idx] = { ...rows[idx], ...patch, id };
    return rows[idx];
  },
  nextId: (): number => rows.reduce((max, w) => Math.max(max, w.id), 0) + 1
};
