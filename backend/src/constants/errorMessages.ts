export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  SCHEDULE_PLAN_NOT_APPROVED: "only approved restoration plans can be scheduled",
  SCHEDULE_OUTSIDE_WINDOW: "the requested time is outside the workstation service window",
  SCHEDULE_STEP_NOT_PENDING: "the step is already scheduled or started and cannot be scheduled again",
  SCHEDULE_SLOT_OCCUPIED: "the workstation slot was taken by an earlier request",
  SCHEDULE_WRITE_FAILED: "failed to persist the schedule; original schedule and request are kept, please retry",
  SCHEDULE_REQUEST_NOT_PENDING: "only a pending request can be retried",
  SCHEDULE_INVALIDATED: "the schedule was invalidated after a relic condition or plan change, please reschedule",
  STEP_NOT_ASSIGNED: "only the restorer assigned to this step can operate it"
};
