export const LOG_TEMPLATES = {
  RelicItem: ["RelicItem.create", "RelicItem.update", "RelicItem.status", "RelicItem.export"],
  DamageRecord: ["DamageRecord.create", "DamageRecord.update", "DamageRecord.status", "DamageRecord.export"],
  RestorationPlan: ["RestorationPlan.create", "RestorationPlan.update", "RestorationPlan.status", "RestorationPlan.export", "RestorationPlan.approve"],
  RestorationStep: ["RestorationStep.create", "RestorationStep.update", "RestorationStep.status", "RestorationStep.export", "RestorationStep.start", "RestorationStep.complete"],
  ImageVersion: ["ImageVersion.create", "ImageVersion.update", "ImageVersion.status", "ImageVersion.export"],
  Workstation: ["Workstation.create", "Workstation.update", "Workstation.status", "Workstation.export"],
  WorkstationSchedule: ["Schedule.create", "Schedule.occupy", "Schedule.invalidate", "Schedule.retry", "Schedule.cancel"],
  ScheduleApplication: ["Application.submit", "Application.confirm", "Application.fail", "Application.retry"]
};
