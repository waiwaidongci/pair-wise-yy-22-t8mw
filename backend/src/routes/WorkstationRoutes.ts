import { Router } from "express";
import { workstationController } from "../controllers/WorkstationController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

router.get("/", workstationController.list);
router.post("/", rbacMiddleware(["scheduler"]), workstationController.create);
router.put("/:id", rbacMiddleware(["scheduler"]), workstationController.update);

export default router;
