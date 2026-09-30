import { Router } from "express";
import { restorationPlanController } from "../controllers/RestorationPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", restorationPlanController.list);
router.post("/", restorationPlanController.create);
// 方案内容变更 -> 触发未开始排程失效
router.put("/:id", rbacMiddleware(["scheduler"]), restorationPlanController.update);
// 专家仍处理审批
router.post("/:id/approve", rbacMiddleware(["expert"]), restorationPlanController.approve);
router.post("/:id/reject", rbacMiddleware(["expert"]), restorationPlanController.reject);

export default router;
