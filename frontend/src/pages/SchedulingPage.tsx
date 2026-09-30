import { useEffect, useMemo, useState } from "react";
import { useSessionStore } from "../stores/SessionStore";
import { useWorkstationStore } from "../stores/WorkstationStore";
import { useScheduleStore } from "../stores/ScheduleStore";
import { useRestorationStepStore } from "../stores/RestorationStepStore";
import { WorkstationCard } from "../components/common/WorkstationCard";
import { OccupationNotice } from "../components/common/OccupationNotice";
import { ApplicationRetryCard } from "../components/common/ApplicationRetryCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { formatDate } from "../utils/formatters";

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SchedulingPage() {
  const { session } = useSessionStore();
  const { rows: workstations, load: loadWs } = useWorkstationStore();
  const {
    schedules,
    applications,
    loading,
    error,
    occupant,
    load: loadSchedules,
    scheduleStep,
    retry,
    clearNotices
  } = useScheduleStore();
  const { rows: steps, load: loadSteps, transition, error: stepError, clearError } = useRestorationStepStore();

  const [selectedWs, setSelectedWs] = useState<number | null>(null);
  const [stepId, setStepId] = useState<number>(1);
  const [startAt, setStartAt] = useState<string>(toLocalInput(new Date(Date.now() + 2 * 24 * 3600 * 1000)));
  const [endAt, setEndAt] = useState<string>(toLocalInput(new Date(Date.now() + 2 * 24 * 3600 * 1000 + 3600 * 1000)));
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadWs();
    loadSchedules();
    loadSteps();
  }, [loadWs, loadSchedules, loadSteps]);

  const isScheduler = session.role === "scheduler";
  const isTechnician = session.role === "technician";

  const wsSchedules = useMemo(
    () => schedules.filter((s) => s.workstation_id === selectedWs && s.status !== "CANCELLED"),
    [schedules, selectedWs]
  );
  const pendingApps = useMemo(
    () => applications.filter((a) => a.status === "PENDING" || a.status === "FAILED"),
    [applications]
  );

  const handleSchedule = async () => {
    if (selectedWs == null) return;
    clearNotices();
    setNotice(null);
    const result = await scheduleStep({
      step_id: stepId,
      workstation_id: selectedWs,
      scheduled_start: new Date(startAt).toISOString(),
      scheduled_end: new Date(endAt).toISOString()
    });
    if (result) {
      setNotice(`已占位：排程 #${result.schedule.id}，申请 #${result.application.id} 已确认`);
    }
  };

  const handleRetry = async (id: number) => {
    setRetryingId(id);
    clearNotices();
    setNotice(null);
    const result = await retry(id);
    if (result) setNotice(`重试成功：排程 #${result.schedule.id} 已确认`);
    setRetryingId(null);
  };

  const handleTransition = async (id: number, action: "start" | "complete") => {
    clearError();
    setNotice(null);
    const ok = await transition(id, action);
    if (ok) setNotice(action === "start" ? "已开始执行，步骤进入进行中" : "步骤已完成");
  };

  return (
    <main className="page scheduling">
      <section className="page-head">
        <div>
          <p className="eyebrow">scheduling</p>
          <h1>工位排程</h1>
        </div>
        <StatusBadge value={session.role} />
      </section>

      {notice && <div className="notice ok">{notice}</div>}
      {error && (
        <div className="notice err">
          <strong>操作失败：{error}</strong>
          {occupant && <OccupationNotice occupant={occupant} />}
        </div>
      )}
      {stepError && (
        <div className="notice err">
          <strong>步骤操作被拒绝：{stepError}</strong>
        </div>
      )}

      <section className="sched-grid">
        <div className="panel">
          <h2>工位（有限容量 · 时间窗）</h2>
          <div className="ws-list">
            {workstations.map((ws) => (
              <WorkstationCard key={ws.id} ws={ws} selected={selectedWs === ws.id} onSelect={() => setSelectedWs(ws.id)} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>排程占位</h2>
          {selectedWs == null ? (
            <EmptyState title="请先选择一个工位" />
          ) : (
            <div className="sched-form">
              <label>
                修复步骤
                <select value={stepId} onChange={(e) => setStepId(Number(e.target.value))}>
                  {steps.map((s) => (
                    <option key={s.id} value={s.id}>
                      步骤 #{s.id}（方案 {s.plan_id}）· {s.technique}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                开始时间
                <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
              </label>
              <label>
                结束时间
                <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
              </label>
              {isScheduler ? (
                <button type="button" className="btn primary" onClick={handleSchedule} disabled={loading}>
                  {loading ? "占位中…" : "抢占该时段"}
                </button>
              ) : (
                <p className="hint">仅调度员可排程，当前角色：{session.role}</p>
              )}
              <p className="hint">
                先到者占位，后到者收到占用说明；占位失败保留原排程与待处理申请，可在下方重试。
              </p>
            </div>
          )}

          <h2 className="mt">该工位排程</h2>
          {wsSchedules.length === 0 ? (
            <EmptyState title="暂无排程" />
          ) : (
            <div className="table">
              {wsSchedules.map((s) => (
                <article key={s.id} className="row sched-row">
                  <div>
                    <strong>
                      排程 #{s.id} · 步骤 #{s.step_id}
                    </strong>
                    <span className="muted">
                      {formatDate(s.scheduled_start)} ~ {formatDate(s.scheduled_end)}
                    </span>
                    <span className="muted">占位：{s.occupied_by_name}</span>
                  </div>
                  <StatusBadge value={s.status} />
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>待处理申请（占位失败 · 可重试）</h2>
        {pendingApps.length === 0 ? (
          <EmptyState title="没有待处理申请" />
        ) : (
          <div className="app-grid">
            {pendingApps.map((app) => (
              <ApplicationRetryCard
                key={app.id}
                app={app}
                retrying={retryingId === app.id}
                onRetry={isScheduler ? () => handleRetry(app.id) : undefined}
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>修复步骤执行（修复师仅执行分给自己的步骤）</h2>
        <div className="table">
          {steps.map((s) => {
            const mine = s.operator_id === session.userId;
            const canStart = isTechnician && mine && (s.step_status === "PENDING" || s.step_status === "SCHEDULED");
            const canComplete = isTechnician && mine && s.step_status === "IN_PROGRESS";
            return (
              <article key={s.id} className="row step-row">
                <div>
                  <strong>
                    步骤 #{s.id} · {s.technique}
                  </strong>
                  <span className="muted">
                    方案 {s.plan_id} · 分配给 {s.operator_id}
                    {mine ? "（我）" : ""}
                  </span>
                </div>
                <div className="step-actions">
                  <StatusBadge value={s.step_status} />
                  {canStart && (
                    <button type="button" className="btn primary" onClick={() => handleTransition(s.id, "start")}>
                      开始
                    </button>
                  )}
                  {canComplete && (
                    <button type="button" className="btn" onClick={() => handleTransition(s.id, "complete")}>
                      完成
                    </button>
                  )}
                  {isTechnician && !mine && <span className="muted">未分配给我</span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
