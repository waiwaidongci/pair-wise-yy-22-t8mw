import { useState } from "react";
import type { Workstation } from "../../types/Workstation";
import type { RestorationStep } from "../../types/RestorationStep";
import { createScheduleRequestForm } from "../../constructors/ScheduleRequestConstructor";
import type { CreateScheduleRequestInput } from "../../types/ScheduleRequest";

type Props = {
  workstations: Workstation[];
  steps: RestorationStep[];
  initial?: Partial<CreateScheduleRequestInput>;
  onSubmit: (input: CreateScheduleRequestInput) => void;
  onCancel: () => void;
};

// datetime-local values have no timezone suffix; the backend compares HH:MM
// against the workstation window, so we keep local wall-clock strings.
const toLocalInput = (iso?: string) => (iso ? iso.slice(0, 16) : "");
const toIso = (local: string) => (local ? new Date(local).toISOString() : local);

export function BookingForm({ workstations, steps, initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(
    createScheduleRequestForm({
      step_id: initial?.step_id ?? steps[0]?.id ?? 1,
      workstation_id: initial?.workstation_id ?? workstations[0]?.id ?? 1,
      start_at: initial?.start_at ? toLocalInput(initial.start_at) : "",
      end_at: initial?.end_at ? toLocalInput(initial.end_at) : ""
    })
  );

  const selected = workstations.find((ws) => ws.id === form.workstation_id);

  const submit = () =>
    onSubmit({
      step_id: Number(form.step_id),
      workstation_id: Number(form.workstation_id),
      start_at: toIso(form.start_at),
      end_at: toIso(form.end_at)
    });

  return (
    <div className="panel booking-form">
      <h2>排入工位</h2>
      <label>
        修复步骤（仅已批准方案的待开始步骤）
        <select value={form.step_id} onChange={(e) => setForm({ ...form, step_id: Number(e.target.value) })}>
          {steps.map((step) => (
            <option key={step.id} value={step.id}>
              #{step.id} {step.technique}
            </option>
          ))}
        </select>
      </label>
      <label>
        工位（容量 / 时间窗）
        <select
          value={form.workstation_id}
          onChange={(e) => setForm({ ...form, workstation_id: Number(e.target.value) })}
        >
          {workstations.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.code} {ws.name} · 容量{ws.capacity} · {ws.open_from}-{ws.open_until}
            </option>
          ))}
        </select>
      </label>
      <label>
        开始
        <input
          type="datetime-local"
          value={form.start_at}
          onChange={(e) => setForm({ ...form, start_at: e.target.value })}
        />
      </label>
      <label>
        结束
        <input
          type="datetime-local"
          value={form.end_at}
          onChange={(e) => setForm({ ...form, end_at: e.target.value })}
        />
      </label>
      {selected && (
        <p className="muted">
          所选工位时间窗 {selected.open_from}–{selected.open_until}，超出或被先到申请占用时将返回占用说明。
        </p>
      )}
      <div className="form-actions">
        <button className="action-btn primary" onClick={submit} disabled={!form.start_at || !form.end_at}>
          提交排程
        </button>
        <button className="action-btn" onClick={onCancel}>
          取消
        </button>
      </div>
    </div>
  );
}
