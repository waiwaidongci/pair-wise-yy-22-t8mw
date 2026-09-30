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
  owner_id TEXT
);

CREATE TABLE IF NOT EXISTS restoration_step (
  id INTEGER PRIMARY KEY,
  plan_id TEXT,
  step_order TEXT,
  technique TEXT,
  material_used TEXT,
  operator_id TEXT,
  step_status TEXT,
  finished_at TEXT
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

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS workstation (
  id INTEGER PRIMARY KEY,
  code TEXT,
  name TEXT,
  capacity INTEGER,
  window_start TEXT,
  window_end TEXT,
  status TEXT,
  location TEXT
);

CREATE TABLE IF NOT EXISTS workstation_schedule (
  id INTEGER PRIMARY KEY,
  step_id INTEGER,
  plan_id INTEGER,
  relic_id INTEGER,
  workstation_id INTEGER,
  scheduled_start TEXT,
  scheduled_end TEXT,
  status TEXT,
  occupied_by INTEGER,
  occupied_by_name TEXT,
  occupied_at TEXT,
  version INTEGER,
  invalid_reason TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS schedule_application (
  id INTEGER PRIMARY KEY,
  step_id INTEGER,
  plan_id INTEGER,
  relic_id INTEGER,
  workstation_id INTEGER,
  requested_start TEXT,
  requested_end TEXT,
  status TEXT,
  attempts INTEGER,
  last_error_code TEXT,
  last_error_message TEXT,
  occupied_by_name TEXT,
  created_by INTEGER,
  created_at TEXT,
  updated_at TEXT
);
