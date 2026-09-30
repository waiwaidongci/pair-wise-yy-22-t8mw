import type { Request, Response, NextFunction } from "express";
import { workstationService } from "../services/WorkstationService";

export const workstationController = {
  list: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(workstationService.list());
    } catch (e) {
      next(e);
    }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(workstationService.create(req.body));
    } catch (e) {
      next(e);
    }
  },
  update: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(workstationService.update(Number(req.params.id), req.body));
    } catch (e) {
      next(e);
    }
  }
};
