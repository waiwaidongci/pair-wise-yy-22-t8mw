import type { Request, Response, NextFunction } from "express";
import { restorationStepService } from "../services/RestorationStepService";

export const restorationStepController = {
  list: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationStepService.list());
    } catch (e) {
      next(e);
    }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(restorationStepService.create(req.body));
    } catch (e) {
      next(e);
    }
  },
  transition: (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user ?? { id: 1, role: "guest" };
      const result = restorationStepService.transition(
        Number(req.params.id),
        req.params.action as "start" | "complete",
        { id: Number(user.id), role: user.role }
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
};
