import { Router } from "express";
import { relicItemController } from "../controllers/RelicItemController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", relicItemController.list);
router.post("/", relicItemController.create);
// 文物状态/内容变更 -> 触发未开始排程失效
router.put("/:id", rbacMiddleware(["scheduler", "technician", "archivist"]), relicItemController.update);

export default router;
