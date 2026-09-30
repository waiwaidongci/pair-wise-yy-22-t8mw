import { Router } from "express";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";
import { relicItemController } from "../controllers/RelicItemController";

const router = Router();

router.get("/", relicItemController.list);
router.post("/", relicItemController.create);
// A condition change invalidates unstarted schedules of linked plans.
router.patch("/:id/condition", rbacMiddleware(["ARCHIVIST", "EXPERT"]), relicItemController.updateCondition);

export default router;
