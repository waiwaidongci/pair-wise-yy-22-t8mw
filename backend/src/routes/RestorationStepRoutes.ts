import { Router } from "express";
import { restorationStepController } from "../controllers/RestorationStepController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", restorationStepController.list);
router.post("/", restorationStepController.create);
// 修复师执行分给自己的步骤：start / complete
router.post("/:id/:action", rbacMiddleware(["technician"]), restorationStepController.transition);

export default router;
