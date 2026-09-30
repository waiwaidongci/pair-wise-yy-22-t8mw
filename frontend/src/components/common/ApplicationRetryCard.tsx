import type { ScheduleApplication } from "../../types/ScheduleApplication";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../../utils/formatters";

interface Props {
  app: ScheduleApplication;
  onRetry?: () => void;
  retrying?: boolean;
}

export function ApplicationRetryCard({ app, onRetry, retrying }: Props) {
  const retryable = app.status === "PENDING" || app.status === "FAILED";
  return (
    <div className="app-card">
      <div className="app-head">
        <strong>申请 #{app.id}</strong>
        <StatusBadge value={app.status} />
      </div>
      <div className="app-meta">
        <span>步骤 #{app.step_id}</span>
        <span>工位 #{app.workstation_id}</span>
        <span>
          时段 {formatDate(app.requested_start)} ~ {formatDate(app.requested_end)}
        </span>
        <span>已尝试 {app.attempts} 次</span>
      </div>
      {app.last_error_message && (
        <p className="app-err">
          失败原因：{app.last_error_message}
          {app.occupied_by_name ? `（占用者：${app.occupied_by_name}）` : ""}
        </p>
      )}
      {retryable && onRetry && (
        <button type="button" className="btn primary" onClick={onRetry} disabled={retrying}>
          {retrying ? "重试中…" : "重新排程"}
        </button>
      )}
    </div>
  );
}
