import { seed } from "../seed";
import type { RestorationPlan } from "../models/RestorationPlan";

const rows: RestorationPlan[] = seed.restorationPlan.map((row) => ({ ...row })) as RestorationPlan[];

export const restorationPlanRepository = {
  findAll: (): RestorationPlan[] => rows,
  findById: (id: number): RestorationPlan | undefined => rows.find((row) => row.id === id),
  save: (row: RestorationPlan): RestorationPlan => {
    rows.push(row);
    return row;
  },
  update: (id: number, patch: Partial<RestorationPlan>): RestorationPlan | undefined => {
    const row = rows.find((plan) => plan.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
