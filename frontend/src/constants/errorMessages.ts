export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  SCHEDULE_PLAN_NOT_APPROVED: "只有已批准的修复方案才能排程",
  SCHEDULE_OUTSIDE_WINDOW: "申请时段超出工位服务时间窗",
  SCHEDULE_STEP_NOT_PENDING: "该步骤已排程或已开始，不能重复排程",
  SCHEDULE_SLOT_OCCUPIED: "该时段工位已被先到的申请占用",
  SCHEDULE_WRITE_FAILED: "占位写入失败，已保留原排程与待处理申请，可重试",
  SCHEDULE_REQUEST_NOT_PENDING: "只有待处理的申请可以重试",
  SCHEDULE_INVALIDATED: "文物状态或方案变更后排程已失效，请重新排程",
  STEP_NOT_ASSIGNED: "只有被分配该步骤的修复师才能操作"
};
