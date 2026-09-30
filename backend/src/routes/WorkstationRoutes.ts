import { Router } from "express";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";
import { workstationController } from "../controllers/WorkstationController";

const router = Router();

router.get("/", workstationController.list);
router.post("/", rbacMiddleware(["SCHEDULER"]), workstationController.create);

export default router;
