import { StatusBadge } from "./StatusBadge";
import { ScheduleRequestStatusText } from "../../constants/ScheduleRequestStatus";
import { formatDate } from "../../utils/formatters";
import type { ScheduleRequest } from "../../types/ScheduleRequest";

type Props = {
  request: ScheduleRequest;
  workstationCode?: string;
  stepLabel?: string;
  onRetry?: (id: number) => void;
  onReschedule?: (request: ScheduleRequest) => void;
};

export function ScheduleRequestCard({ request, workstationCode, stepLabel, onRetry, onReschedule }: Props) {
  const note = request.invalidated_reason ?? request.conflict_reason;
  return (
    <article className={`panel schedule-card status-${request.status.toLowerCase()}`}>
      <div className="row" style={{ gridTemplateColumns: "1fr auto" }}>
        <strong>
          申请 #{request.id} · 步骤 {stepLabel ?? request.step_id}
        </strong>
        <StatusBadge value={request.status} />
      </div>
      <p className="muted">
        工位 {workstationCode ?? request.workstation_id} · {formatDate(request.start_at)} ~{" "}
        {formatDate(request.end_at)}
      </p>
      <p className="muted">状态：{ScheduleRequestStatusText[request.status]}</p>
      {note && <p className="notice-text">{note}</p>}
      {request.status === "PENDING" && onRetry && (
        <button className="action-btn" onClick={() => onRetry(request.id)}>
          重试占位
        </button>
      )}
      {request.status === "INVALIDATED" && onReschedule && (
        <button className="action-btn" onClick={() => onReschedule(request)}>
          重新排程
        </button>
      )}
    </article>
  );
}
