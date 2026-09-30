CREATE TABLE IF NOT EXISTS relic_item (
  id INTEGER PRIMARY KEY,
  relic_code TEXT,
  name TEXT,
  era TEXT,
  material TEXT,
  collection_level TEXT,
  storage_location TEXT,
  current_condition TEXT
);

CREATE TABLE IF NOT EXISTS damage_record (
  id INTEGER PRIMARY KEY,
  relic_id TEXT,
  damage_type TEXT,
  position_desc TEXT,
  severity TEXT,
  discovered_by TEXT,
  discovered_at TEXT,
  image_url TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS restoration_plan (
  id INTEGER PRIMARY KEY,
  relic_id TEXT,
  damage_record_id TEXT,
  plan_title TEXT,
  method TEXT,
  risk_assessment TEXT,
  approval_status TEXT,
  owner_id TEXT,
  content_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS restoration_step (
  id INTEGER PRIMARY KEY,
  plan_id TEXT,
  step_order TEXT,
  technique TEXT,
  material_used TEXT,
  operator_id TEXT,
  step_status TEXT,
  finished_at TEXT,
  scheduled_workstation_id INTEGER,
  scheduled_start_at TEXT,
  scheduled_end_at TEXT
);

CREATE TABLE IF NOT EXISTS image_version (
  id INTEGER PRIMARY KEY,
  relic_id TEXT,
  plan_id TEXT,
  version_no TEXT,
  image_type TEXT,
  file_path TEXT,
  capture_at TEXT,
  note TEXT
);

-- 修复工位：容量 + 服务时间窗
CREATE TABLE IF NOT EXISTS workstation (
  id INTEGER PRIMARY KEY,
  code TEXT,
  name TEXT,
  capacity INTEGER NOT NULL DEFAULT 1,
  open_from TEXT NOT NULL,
  open_until TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 工位排程申请：先到者占位；后到者保留为 PENDING 并记录占用说明；
-- 文物状态或方案内容变更后未开始的排程置为 INVALIDATED。
CREATE TABLE IF NOT EXISTS schedule_request (
  id INTEGER PRIMARY KEY,
  step_id INTEGER NOT NULL,
  workstation_id INTEGER NOT NULL,
  requested_by INTEGER NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL,
  decided_at TEXT,
  conflict_reason TEXT,
  conflict_workstation_id INTEGER,
  occupied_by_request_id INTEGER,
  invalidated_reason TEXT
);

-- 同一工位的时间重叠由应用层按容量校验，这里仅补充常用索引。
CREATE INDEX IF NOT EXISTS idx_schedule_request_workstation_time
  ON schedule_request (workstation_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_schedule_request_step ON schedule_request (step_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);
