import { Router } from "express";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";
import { restorationPlanController } from "../controllers/RestorationPlanController";

const router = Router();

router.get("/", restorationPlanController.list);
router.post("/", restorationPlanController.create);
// Experts still handle approval.
router.post("/:id/approve", rbacMiddleware(["EXPERT"]), restorationPlanController.approve);
// Plan content changes (dispatchers/experts may edit) trigger rescheduling.
router.patch("/:id", rbacMiddleware(["EXPERT", "SCHEDULER"]), restorationPlanController.change);

export default router;
