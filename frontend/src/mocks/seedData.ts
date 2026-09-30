export const mockData = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "relic code 1",
      "name": "name 1",
      "era": "era 1",
      "material": "material 1",
      "collection_level": "LOW",
      "storage_location": "storage location 1",
      "current_condition": "current condition 1"
    },
    {
      "id": 2,
      "relic_code": "relic code 2",
      "name": "name 2",
      "era": "era 2",
      "material": "material 2",
      "collection_level": "MEDIUM",
      "storage_location": "storage location 2",
      "current_condition": "current condition 2"
    },
    {
      "id": 3,
      "relic_code": "relic code 3",
      "name": "name 3",
      "era": "era 3",
      "material": "material 3",
      "collection_level": "HIGH",
      "storage_location": "storage location 3",
      "current_condition": "current condition 3"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "FRAGILE",
      "position_desc": "position desc 1",
      "severity": "severity 1",
      "discovered_by": "discovered by 1",
      "discovered_at": "2026-06-11T09:00:00Z",
      "image_url": "/mock/image_url-1.png",
      "status": "SUBMITTED"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "DAMAGED",
      "position_desc": "position desc 2",
      "severity": "severity 2",
      "discovered_by": "discovered by 2",
      "discovered_at": "2026-06-12T09:00:00Z",
      "image_url": "/mock/image_url-2.png",
      "status": "APPROVED"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "IN_RESTORATION",
      "position_desc": "position desc 3",
      "severity": "severity 3",
      "discovered_by": "discovered by 3",
      "discovered_at": "2026-06-13T09:00:00Z",
      "image_url": "/mock/image_url-3.png",
      "status": "DRAFT"
    }
  ],
  "restorationPlan": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_record_id": 1,
      "plan_title": "plan title 1",
      "method": "method 1",
      "risk_assessment": "risk assessment 1",
      "approval_status": "SUBMITTED",
      "owner_id": 1
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_record_id": 2,
      "plan_title": "plan title 2",
      "method": "method 2",
      "risk_assessment": "risk assessment 2",
      "approval_status": "APPROVED",
      "owner_id": 2
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_record_id": 3,
      "plan_title": "plan title 3",
      "method": "method 3",
      "risk_assessment": "risk assessment 3",
      "approval_status": "DRAFT",
      "owner_id": 3
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 1,
      "step_order": "step order 1",
      "technique": "technique 1",
      "material_used": "material used 1",
      "operator_id": 1,
      "step_status": "SUBMITTED",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "plan_id": 2,
      "step_order": "step order 2",
      "technique": "technique 2",
      "material_used": "material used 2",
      "operator_id": 2,
      "step_status": "APPROVED",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "plan_id": 3,
      "step_order": "step order 3",
      "technique": "technique 3",
      "material_used": "material used 3",
      "operator_id": 3,
      "step_status": "DRAFT",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 1,
      "plan_id": 1,
      "version_no": "version no 1",
      "image_type": "FRAGILE",
      "file_path": "file path 1",
      "capture_at": "2026-06-11T09:00:00Z",
      "note": "note 1"
    },
    {
      "id": 2,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "version no 2",
      "image_type": "DAMAGED",
      "file_path": "file path 2",
      "capture_at": "2026-06-12T09:00:00Z",
      "note": "note 2"
    },
    {
      "id": 3,
      "relic_id": 3,
      "plan_id": 3,
      "version_no": "version no 3",
      "image_type": "IN_RESTORATION",
      "file_path": "file path 3",
      "capture_at": "2026-06-13T09:00:00Z",
      "note": "note 3"
    }
  ],
  "workstation": [
    { "id": 1, "code": "WS-A", "name": "修复台 A", "capacity": 1, "window_start": "09:00", "window_end": "18:00", "status": "ACTIVE", "location": "修复室 1 区" },
    { "id": 2, "code": "WS-B", "name": "修复台 B", "capacity": 2, "window_start": "09:00", "window_end": "18:00", "status": "ACTIVE", "location": "修复室 1 区" },
    { "id": 3, "code": "WS-C", "name": "检测工位 C", "capacity": 1, "window_start": "10:00", "window_end": "16:00", "status": "MAINTENANCE", "location": "检测室" },
    { "id": 4, "code": "WS-D", "name": "装裱工位 D", "capacity": 1, "window_start": "13:00", "window_end": "20:00", "status": "ACTIVE", "location": "装裱室" }
  ],
  "workstationSchedule": [
    { "id": 1, "step_id": 2, "plan_id": 2, "relic_id": 2, "workstation_id": 1, "scheduled_start": "2026-09-30T10:00:00Z", "scheduled_end": "2026-09-30T11:00:00Z", "status": "SCHEDULED", "occupied_by": 1, "occupied_by_name": "调度员 林岚", "occupied_at": "2026-09-30T08:00:00Z", "version": 1, "invalid_reason": null, "created_at": "2026-09-30T08:00:00Z" },
    { "id": 2, "step_id": 3, "plan_id": 3, "relic_id": 3, "workstation_id": 2, "scheduled_start": "2026-10-01T10:00:00Z", "scheduled_end": "2026-10-01T12:00:00Z", "status": "SCHEDULED", "occupied_by": 1, "occupied_by_name": "调度员 林岚", "occupied_at": "2026-09-30T09:00:00Z", "version": 1, "invalid_reason": null, "created_at": "2026-09-30T09:00:00Z" }
  ],
  "scheduleApplication": [
    { "id": 1, "step_id": 1, "plan_id": 1, "relic_id": 1, "workstation_id": 1, "requested_start": "2026-09-30T10:30:00Z", "requested_end": "2026-09-30T11:30:00Z", "status": "PENDING", "attempts": 1, "last_error_code": "SLOT_OCCUPIED", "last_error_message": "该时段已被占用", "occupied_by_name": "调度员 林岚", "created_by": 1, "created_at": "2026-09-30T09:00:00Z", "updated_at": "2026-09-30T09:00:00Z" }
  ]
} as const;
