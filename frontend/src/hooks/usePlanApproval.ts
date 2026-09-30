import { useCallback } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";

// Experts approve plans; plan content changes invalidate unstarted schedules.
export function usePlanApproval(headers?: HeadersInit) {
  const rows = useRestorationPlanStore((state) => state.rows);
  const message = useRestorationPlanStore((state) => state.message);
  const approve = useRestorationPlanStore((state) => state.approve);
  const change = useRestorationPlanStore((state) => state.change);

  const pendingApprovals = rows.filter((plan) => plan.approval_status === "SUBMITTED");

  const approvePlan = useCallback((id: number) => approve(id, headers), [approve, headers]);
  const changePlan = useCallback(
    (id: number, patch: { method?: string; risk_assessment?: string; plan_title?: string }) =>
      change(id, patch, headers),
    [change, headers]
  );

  return { rows, pendingApprovals, message, approvePlan, changePlan };
}
