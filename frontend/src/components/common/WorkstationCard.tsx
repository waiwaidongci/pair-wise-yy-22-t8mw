import type { Workstation } from "../../types/Workstation";
import { StatusBadge } from "./StatusBadge";

interface Props {
  ws: Workstation;
  selected?: boolean;
  onSelect?: () => void;
}

export function WorkstationCard({ ws, selected, onSelect }: Props) {
  return (
    <button type="button" className={"ws-card" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="ws-head">
        <strong>{ws.name}</strong>
        <StatusBadge value={ws.status} />
      </div>
      <div className="ws-meta">
        <span>编号 {ws.code}</span>
        <span>容量 {ws.capacity}</span>
        <span>
          时间窗 {ws.window_start}–{ws.window_end}
        </span>
      </div>
      <div className="ws-loc">{ws.location}</div>
    </button>
  );
}
