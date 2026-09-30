import { useEffect, useState } from "react";
import { useSessionStore } from "../stores/SessionStore";
import { useWorkstationStore } from "../stores/WorkstationStore";
import { useRestorationStepStore } from "../stores/RestorationStepStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useScheduleRequestStore } from "../stores/ScheduleRequestStore";
import { useWorkstationSchedule } from "../hooks/useWorkstationSchedule";
import { WorkstationCard } from "../components/common/WorkstationCard";
import { ScheduleRequestCard } from "../components/common/ScheduleRequestCard";
import { BookingForm } from "../components/common/BookingForm";
import { StatusBadge } from "../components/common/StatusBadge";
import { StepStatusText } from "../constants/StepStatus";
import { ScheduleRequestStatusText } from "../constants/ScheduleRequestStatus";
import type { ScheduleRequest } from "../types/ScheduleRequest";

export function SchedulePage() {
  const headers = useSessionStore((state) => state.headers());
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);

  const loadWorkstations = useWorkstationStore((state) => state.load);
  const loadSteps = useRestorationStepStore((state) => state.load);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const loadRequests = useScheduleRequestStore((state) => state.load);
  const startStep = useRestorationStepStore((state) => state.start);
  const completeStep = useRestorationStepStore((state) => state.complete);
  const stepMessage = useRestorationStepStore((state) => state.message);

  const [booking, setBooking] = useState<{ open: boolean; initial?: Partial<ScheduleRequest> }>({ open: false });

  const schedule = useWorkstationSchedule(headers);

  useEffect(() => {
    loadWorkstations(headers);
    loadSteps(headers);
    loadPlans(headers);
    loadRequests(headers);
  }, [headers, loadWorkstations, loadSteps, loadPlans, loadRequests, role, userId]);

  const stepLabel = (id: number) => {
    const step = useRestorationStepStore.getState().rows.find((item) => item.id === id);
    return step ? `${id} ${step.technique}` : String(id);
  };
  const wsCode = (id: number) =>
    useWorkstationStore.getState().rows.find((item) => item.id === id)?.code ?? String(id);

  const mySteps =
    role === "RESTORER"
      ? useRestorationStepStore.getState().rows.filter((step) => step.operator_id === userId)
      : [];

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">relic-restore / scheduling</p>
          <h1>修复室工位排程</h1>
          <p className="muted">
            调度员把已批准方案的步骤排进有容量与时间窗的工位；修复师只执行分给自己的步骤；专家负责审批。
          </p>
        </div>
        <StatusBadge value={role} />
      </section>

      {schedule.notice && (
        <section className={`panel notice ${schedule.notice.type}`}>
          <span>{schedule.notice.text}</span>
          <button className="action-btn" onClick={schedule.clearNotice}>
            知道了
          </button>
        </section>
      )}
      {stepMessage && <section className="panel notice info">{stepMessage}</section>}

      <section>
        <h2>工位（容量 · 时间窗）</h2>
        <div className="card-grid">
          {schedule.workstations.map((ws) => (
            <WorkstationCard key={ws.id} workstation={ws} />
          ))}
        </div>
      </section>

      {role === "SCHEDULER" && (
        <section className="workbench">
          <div className="panel wide">
            <div className="row" style={{ gridTemplateColumns: "1fr auto" }}>
              <h2>调度操作</h2>
              <button className="action-btn primary" onClick={() => setBooking({ open: true })}>
                排入步骤
              </button>
            </div>
            {booking.open && (
              <BookingForm
                workstations={schedule.workstations}
                steps={schedule.bookableSteps}
                initial={booking.initial}
                onSubmit={async (input) => {
                  await schedule.place(input);
                  setBooking({ open: false });
                }}
                onCancel={() => setBooking({ open: false })}
              />
            )}
            <p className="muted">
              同一时段先到者占位，后到者保留为「待处理」并收到占用说明；文物状态或方案变更后未开始排程自动失效。
            </p>
          </div>
        </section>
      )}

      {role === "RESTORER" && (
        <section className="workbench">
          <div className="panel wide">
            <h2>分给我的步骤</h2>
            {mySteps.length === 0 && <p className="muted">当前没有分配给你的步骤。</p>}
            {mySteps.map((step) => (
              <article key={step.id} className="row" style={{ gridTemplateColumns: "2fr 1fr auto" }}>
                <strong>
                  #{step.id} {step.technique}
                </strong>
                <span>
                  <StatusBadge value={step.step_status} /> {StepStatusText[step.step_status]}
                  {step.scheduled_workstation_id && (
                    <span className="muted"> · {wsCode(step.scheduled_workstation_id)}</span>
                  )}
                </span>
                <span>
                  {step.step_status === "PENDING" && step.scheduled_workstation_id && (
                    <button className="action-btn" onClick={() => startStep(step.id, headers)}>
                      开始执行
                    </button>
                  )}
                  {step.step_status === "IN_PROGRESS" && (
                    <button className="action-btn primary" onClick={() => completeStep(step.id, headers)}>
                      完成
                    </button>
                  )}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>排程申请（{schedule.requests.length}）</h2>
        <div className="card-grid">
          {schedule.requests.map((request) => (
            <ScheduleRequestCard
              key={request.id}
              request={request}
              workstationCode={wsCode(request.workstation_id)}
              stepLabel={stepLabel(request.step_id)}
              onRetry={role === "SCHEDULER" && schedule.canRetry(request.id) ? (id) => schedule.retry(id) : undefined}
              onReschedule={
                role === "SCHEDULER"
                  ? (current: ScheduleRequest) =>
                      setBooking({ open: true, initial: { step_id: current.step_id, workstation_id: current.workstation_id } })
                  : undefined
              }
            />
          ))}
        </div>
        <p className="muted">
          状态说明：{Object.entries(ScheduleRequestStatusText).map(([key, text]) => `${key}=${text}`).join("；")}
        </p>
      </section>
    </main>
  );
}
