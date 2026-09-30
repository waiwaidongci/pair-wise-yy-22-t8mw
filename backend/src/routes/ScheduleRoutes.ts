import { Router } from "express";
import { scheduleController } from "../controllers/ScheduleController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

// 排程
router.get("/schedules", scheduleController.listSchedules);
router.post("/schedules", rbacMiddleware(["scheduler"]), scheduleController.createSchedule);

// 待处理申请与重试
router.get("/applications", scheduleController.listApplications);
router.post("/applications/:id/retry", rbacMiddleware(["scheduler"]), scheduleController.retryApplication);

export default router;
