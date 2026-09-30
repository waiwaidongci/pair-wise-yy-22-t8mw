import { useCallback, useMemo } from "react";
import { useScheduleRequestStore } from "../stores/ScheduleRequestStore";
import { useWorkstationStore } from "../stores/WorkstationStore";
import { useRestorationStepStore } from "../stores/RestorationStepStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { isRetriable } from "../api/ScheduleRequest";
import type { ApiError, CreateScheduleRequestInput } from "../types/ScheduleRequest";

// Dispatchers place steps into capacity/time-window-bounded workstations.
// Conflicts leave a pending request with an occupancy note; invalidated
// requests must be rescheduled rather than retried.
export function useWorkstationSchedule(headers?: HeadersInit) {
  const requests = useScheduleRequestStore((state) => state.rows);
  const notice = useScheduleRequestStore((state) => state.notice);
  const requestPlace = useScheduleRequestStore((state) => state.request);
  const retryPlace = useScheduleRequestStore((state) => state.retry);
  const clearNotice = useScheduleRequestStore((state) => state.clearNotice);

  const workstations = useWorkstationStore((state) => state.rows);
  const steps = useRestorationStepStore((state) => state.rows);
  const plans = useRestorationPlanStore((state) => state.rows);

  const bookableSteps = useMemo(
    () =>
      steps.filter((step) => {
        const plan = plans.find((item) => item.id === step.plan_id);
        // Only approved plans with not-started steps can be scheduled.
        return plan?.approval_status === "APPROVED" && step.step_status === "PENDING";
      }),
    [steps, plans]
  );

  const place = useCallback(
    (input: CreateScheduleRequestInput) => requestPlace(input, headers),
    [requestPlace, headers]
  );

  const retry = useCallback(
    async (id: number) => {
      const result = await retryPlace(id, headers);
      return result;
    },
    [retryPlace, headers]
  );

  const canRetry = useCallback(
    (id: number) => {
      const current = requests.find((row) => row.id === id);
      if (!current || current.status !== "PENDING") return false;
      // Pending after a conflict/window/write failure is retriable.
      return current.conflict_reason !== null;
    },
    [requests]
  );

  return {
    workstations,
    bookableSteps,
    requests,
    notice,
    place,
    retry,
    canRetry,
    clearNotice,
    isRetriableError: isRetriable as (error: ApiError) => boolean
  };
}
