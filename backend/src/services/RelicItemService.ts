import { relicItemRepository } from "../repositories/RelicItemRepository";
import { invalidateRelicSchedule } from "./RestorationPlanService";
import { HttpError } from "../utils/httpError";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { RelicItem } from "../models/RelicItem";

export const relicItemService = {
  list: (): RelicItem[] => relicItemRepository.findAll(),
  create: (row: unknown): RelicItem => relicItemRepository.save(row as RelicItem),

  // Changing the relic condition invalidates every approved plan's unstarted
  // schedules linked to this relic.
  updateCondition: (id: number, current_condition: string): { relic: RelicItem; invalidated: number } => {
    const relic = relicItemRepository.findById(id);
    if (!relic) throw new HttpError(404, "VALIDATION_FAILED", { field: "id" });
    const conditionChanged = current_condition !== relic.current_condition;
    const updated = relicItemRepository.update(id, { current_condition })!;
    console.info(LOG_TEMPLATES.RelicItem[2], updated.id, current_condition);
    const invalidated = conditionChanged ? invalidateRelicSchedule(updated) : [];
    return { relic: updated, invalidated: invalidated.length };
  }
};
