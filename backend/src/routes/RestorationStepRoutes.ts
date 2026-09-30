import { Router } from "express";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";
import { restorationStepController } from "../controllers/RestorationStepController";

const router = Router();

router.get("/", restorationStepController.list);
router.post("/", rbacMiddleware(["SCHEDULER", "EXPERT"]), restorationStepController.create);
// Only the assigned restorer executes their own step.
router.post("/:id/start", rbacMiddleware(["RESTORER"]), restorationStepController.start);
router.post("/:id/complete", rbacMiddleware(["RESTORER"]), restorationStepController.complete);

export default router;
