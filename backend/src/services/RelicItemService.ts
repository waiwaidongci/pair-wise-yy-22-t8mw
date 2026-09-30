import { relicItemRepository } from "../repositories/RelicItemRepository";
import { scheduleService } from "./ScheduleService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { httpError } from "../utils/httpError";

export const relicItemService = {
  list: () => relicItemRepository.findAll(),
  create: (row: unknown) => relicItemRepository.save(row),

  /**
   * 文物状态/内容变更：更新后触发该文物未开始排程失效，返回提示重排说明。
   */
  update: (id: number, patch: Record<string, unknown>) => {
    const row = relicItemRepository.findAll().find((r: any) => Number(r.id) === id);
    if (!row) throw httpError(404, ERROR_CODES.VALIDATION_FAILED, "文物不存在");
    const before = { ...(row as object) } as Record<string, unknown>;
    Object.assign(row, patch, { id: (row as any).id });
    const conditionChanged = patch.current_condition !== undefined && patch.current_condition !== before.current_condition;
    const invalidation = conditionChanged
      ? scheduleService.invalidateUnstartedByRelic(
          id,
          `文物状态由 ${before.current_condition ?? ""} 变更为 ${(row as any).current_condition ?? ""}`
        )
      : { invalidated: [], notice: "" };
    return { relic: row, invalidation };
  }
};
