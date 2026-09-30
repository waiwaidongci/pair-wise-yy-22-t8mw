import { StatusBadge } from "./StatusBadge";
import { formatDate } from "../../utils/formatters";
import type { Workstation } from "../../types/Workstation";

export function WorkstationCard({ workstation }: { workstation: Workstation }) {
  return (
    <article className="panel workstation-card">
      <div className="row" style={{ gridTemplateColumns: "1fr auto" }}>
        <strong>
          {workstation.code} · {workstation.name}
        </strong>
        <StatusBadge value={workstation.active ? "ACTIVE" : "INACTIVE"} />
      </div>
      <p className="muted">
        容量 {workstation.capacity} 个并行工位 · 时间窗 {workstation.open_from}–{workstation.open_until}
      </p>
      <p className="muted">开放时间（本地）：{formatDate(`2026-01-01T${workstation.open_from}:00Z`).slice(-8)}</p>
    </article>
  );
}
