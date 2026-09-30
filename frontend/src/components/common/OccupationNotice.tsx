import type { OccupantInfo } from "../../types/WorkstationSchedule";
import { formatDate } from "../../utils/formatters";

export function OccupationNotice({ occupant }: { occupant: OccupantInfo }) {
  return (
    <div className="notice occupation" role="alert">
      <strong>该时段已被占用</strong>
      <p>
        占用者：{occupant.occupied_by_name}（{formatDate(occupant.occupied_at)} 占位）
      </p>
      <p>
        占用时段：{formatDate(occupant.scheduled_start)} ~ {formatDate(occupant.scheduled_end)}
      </p>
      <p>
        占用步骤 #{occupant.step_id}，排程 #{occupant.schedule_id}
      </p>
    </div>
  );
}
