import { seed } from "../seed";
import type { RestorationStep } from "../models/RestorationStep";

const rows: RestorationStep[] = seed.restorationStep.map((row) => ({
  scheduled_workstation_id: null,
  scheduled_start_at: null,
  scheduled_end_at: null,
  ...row
})) as RestorationStep[];

export const restorationStepRepository = {
  findAll: (): RestorationStep[] => rows,
  findById: (id: number): RestorationStep | undefined => rows.find((row) => row.id === id),
  findByPlanId: (planId: number): RestorationStep[] => rows.filter((row) => row.plan_id === planId),
  save: (row: RestorationStep): RestorationStep => {
    rows.push(row);
    return row;
  },
  update: (id: number, patch: Partial<RestorationStep>): RestorationStep | undefined => {
    const row = rows.find((step) => step.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
