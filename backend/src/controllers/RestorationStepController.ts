import type { Request, Response, NextFunction } from "express";
import { restorationStepService } from "../services/RestorationStepService";

const actorId = (req: Request) => (req as unknown as { user: { id: number } }).user.id;

export const restorationStepController = {
  list: (req: Request, res: Response) =>
    res.json(
      (req as unknown as { user: { role: string } }).user.role === "RESTORER"
        ? restorationStepService.listForOperator(actorId(req))
        : restorationStepService.list()
    ),
  create: (req: Request, res: Response) => res.status(201).json(restorationStepService.create(req.body)),

  // Only the assigned restorer can operate their own step.
  start: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationStepService.start(Number(req.params.id), actorId(req)));
    } catch (error) {
      next(error);
    }
  },
  complete: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(restorationStepService.complete(Number(req.params.id), actorId(req)));
    } catch (error) {
      next(error);
    }
  }
};
