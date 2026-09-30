export const LOG_TEMPLATES = {
  RelicItem: ["RelicItem.create", "RelicItem.update", "RelicItem.status", "RelicItem.export"],
  DamageRecord: ["DamageRecord.create", "DamageRecord.update", "DamageRecord.status", "DamageRecord.export"],
  RestorationPlan: ["RestorationPlan.create", "RestorationPlan.update", "RestorationPlan.status", "RestorationPlan.export", "RestorationPlan.approve", "RestorationPlan.change"],
  RestorationStep: ["RestorationStep.create", "RestorationStep.update", "RestorationStep.status", "RestorationStep.export", "RestorationStep.assign", "RestorationStep.start", "RestorationStep.complete"],
  ImageVersion: ["ImageVersion.create", "ImageVersion.update", "ImageVersion.status", "ImageVersion.export"],
  Workstation: ["Workstation.create", "Workstation.update", "Workstation.capacity", "Workstation.export"],
  ScheduleRequest: ["ScheduleRequest.request", "ScheduleRequest.confirm", "ScheduleRequest.reject", "ScheduleRequest.retry", "ScheduleRequest.invalidate"]
};
