import { Router } from "express";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";
import { scheduleRequestController } from "../controllers/ScheduleRequestController";

const router = Router();

// Dispatchers place steps into workstations; repairers/experts may view.
router.get("/", rbacMiddleware(["SCHEDULER", "RESTORER", "EXPERT"]), scheduleRequestController.list);
router.post("/", rbacMiddleware(["SCHEDULER"]), scheduleRequestController.request);
router.post("/:id/retry", rbacMiddleware(["SCHEDULER"]), scheduleRequestController.retry);

export default router;
