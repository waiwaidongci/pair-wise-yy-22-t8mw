import type { Request, Response, NextFunction } from "express";
import { restorationPlanService } from "../services/RestorationPlanService";

export const restorationPlanController = {
  list: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.list());
    } catch (e) {
      next(e);
    }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(restorationPlanService.create(req.body));
    } catch (e) {
      next(e);
    }
  },
  update: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.update(Number(req.params.id), req.body));
    } catch (e) {
      next(e);
    }
  },
  approve: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.approve(Number(req.params.id)));
    } catch (e) {
      next(e);
    }
  },
  reject: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationPlanService.reject(Number(req.params.id)));
    } catch (e) {
      next(e);
    }
  }
};
