export const mockData = {
  "relicItem": [
    {
      "id": 1,
      "relic_code": "QY-001",
      "name": "青铜饕餮纹鼎",
      "era": "商代晚期",
      "material": "青铜",
      "collection_level": "HIGH",
      "storage_location": "一号库 12 架",
      "current_condition": "FRAGILE"
    },
    {
      "id": 2,
      "relic_code": "TC-014",
      "name": "三彩骆驼俑",
      "era": "唐代",
      "material": "陶",
      "collection_level": "MEDIUM",
      "storage_location": "二号库 03 架",
      "current_condition": "DAMAGED"
    },
    {
      "id": 3,
      "relic_code": "SH-208",
      "name": "绢本花鸟团扇",
      "era": "宋代",
      "material": "丝绢",
      "collection_level": "HIGH",
      "storage_location": "恒温恒湿柜 B",
      "current_condition": "STABLE"
    }
  ],
  "damageRecord": [
    {
      "id": 1,
      "relic_id": 1,
      "damage_type": "锈蚀",
      "position_desc": "腹部与口沿",
      "severity": "HIGH",
      "discovered_by": "档案员 1",
      "discovered_at": "2026-06-11T09:00:00Z",
      "image_url": "/mock/image_url-1.png",
      "status": "SUBMITTED"
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_type": "断裂",
      "position_desc": "骆驼颈部",
      "severity": "MEDIUM",
      "discovered_by": "档案员 2",
      "discovered_at": "2026-06-12T09:00:00Z",
      "image_url": "/mock/image_url-2.png",
      "status": "APPROVED"
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_type": "绢本酥朽",
      "position_desc": "扇面左侧",
      "severity": "LOW",
      "discovered_by": "档案员 3",
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
      "plan_title": "青铜鼎除锈与缓蚀方案",
      "method": "机械除锈结合 BTA 缓蚀封护",
      "risk_assessment": "矿化严重，需控制机械力度",
      "approval_status": "SUBMITTED",
      "owner_id": 1,
      "content_version": 1
    },
    {
      "id": 2,
      "relic_id": 2,
      "damage_record_id": 2,
      "plan_title": "三彩骆驼颈部粘接修复方案",
      "method": "环氧树脂粘接 + 矿物颜料随色",
      "risk_assessment": "接口受力，需要在固定工位完成",
      "approval_status": "APPROVED",
      "owner_id": 2,
      "content_version": 2
    },
    {
      "id": 3,
      "relic_id": 3,
      "damage_record_id": 3,
      "plan_title": "绢本团扇托裱加固方案",
      "method": "蚕丝网托裱",
      "risk_assessment": "湿洗风险高",
      "approval_status": "DRAFT",
      "owner_id": 3,
      "content_version": 1
    }
  ],
  "restorationStep": [
    {
      "id": 1,
      "plan_id": 1,
      "step_order": "1",
      "technique": "表面记录与影像采集",
      "material_used": "无",
      "operator_id": 2,
      "step_status": "PENDING",
      "finished_at": null
    },
    {
      "id": 2,
      "plan_id": 2,
      "step_order": "1",
      "technique": "颈部断面清理与预拼接",
      "material_used": "无水乙醇",
      "operator_id": 2,
      "step_status": "PENDING",
      "finished_at": null
    },
    {
      "id": 3,
      "plan_id": 2,
      "step_order": "2",
      "technique": "环氧树脂粘接固定",
      "material_used": "环氧树脂 E-44",
      "operator_id": 2,
      "step_status": "IN_PROGRESS",
      "finished_at": null
    }
  ],
  "imageVersion": [
    {
      "id": 1,
      "relic_id": 1,
      "plan_id": 1,
      "version_no": "v1",
      "image_type": "BEFORE",
      "file_path": "/mock/qy-001-before.png",
      "capture_at": "2026-06-11T09:00:00Z",
      "note": "病害原始影像"
    },
    {
      "id": 2,
      "relic_id": 2,
      "plan_id": 2,
      "version_no": "v1",
      "image_type": "DURING",
      "file_path": "/mock/tc-014-during.png",
      "capture_at": "2026-06-12T09:00:00Z",
      "note": "粘接过程影像"
    },
    {
      "id": 3,
      "relic_id": 3,
      "plan_id": 3,
      "version_no": "v1",
      "image_type": "BEFORE",
      "file_path": "/mock/sh-208-before.png",
      "capture_at": "2026-06-13T09:00:00Z",
      "note": "托裱前影像"
    }
  ],
  "workstation": [
    {
      "id": 1,
      "code": "WS-A01",
      "name": "青铜器修复工位",
      "capacity": 1,
      "open_from": "09:00",
      "open_until": "12:00",
      "active": true
    },
    {
      "id": 2,
      "code": "WS-A02",
      "name": "陶瓷粘接工位",
      "capacity": 2,
      "open_from": "13:00",
      "open_until": "18:00",
      "active": true
    },
    {
      "id": 3,
      "code": "WS-B01",
      "name": "通用固定工位",
      "capacity": 1,
      "open_from": "09:00",
      "open_until": "18:00",
      "active": true
    }
  ],
  "scheduleRequest": [
    {
      "id": 1,
      "step_id": 3,
      "workstation_id": 2,
      "requested_by": 1,
      "start_at": "2026-10-02T13:00:00Z",
      "end_at": "2026-10-02T15:00:00Z",
      "status": "CONFIRMED",
      "created_at": "2026-09-29T08:30:00Z",
      "decided_at": "2026-09-29T08:30:00Z",
      "conflict_reason": null,
      "conflict_workstation_id": null,
      "occupied_by_request_id": null,
      "invalidated_reason": null
    },
    {
      "id": 2,
      "step_id": 2,
      "workstation_id": 3,
      "requested_by": 1,
      "start_at": "2026-10-03T10:00:00Z",
      "end_at": "2026-10-03T12:00:00Z",
      "status": "PENDING",
      "created_at": "2026-09-29T09:05:00Z",
      "decided_at": null,
      "conflict_reason": "工位该时段容量已被更早的申请 #1 占满",
      "conflict_workstation_id": 3,
      "occupied_by_request_id": 1,
      "invalidated_reason": null
    },
    {
      "id": 3,
      "step_id": 1,
      "workstation_id": 1,
      "requested_by": 1,
      "start_at": "2026-10-04T09:00:00Z",
      "end_at": "2026-10-04T11:00:00Z",
      "status": "INVALIDATED",
      "created_at": "2026-09-28T10:00:00Z",
      "decided_at": null,
      "conflict_reason": null,
      "conflict_workstation_id": null,
      "occupied_by_request_id": null,
      "invalidated_reason": "文物状态或方案内容变更，未开始排程失效，请重新排程"
    }
  ]
} as const;
