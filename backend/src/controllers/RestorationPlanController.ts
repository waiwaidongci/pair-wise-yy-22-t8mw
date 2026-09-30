import type { Request, Response, NextFunction } from "express";
import { restorationPlanService } from "../services/RestorationPlanService";

export const restorationPlanController = {
  list: (_req: Request, res: Response) => res.json(restorationPlanService.list()),
  create: (req: Request, res: Response) => res.status(201).json(restorationPlanService.create(req.body)),

  approve: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.approve(Number(req.params.id)));
    } catch (error) {
      next(error);
    }
  },

  change: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.change(Number(req.params.id), req.body ?? {}));
    } catch (error) {
      next(error);
    }
  }
};
