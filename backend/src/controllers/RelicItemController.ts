import type { Request, Response, NextFunction } from "express";
import { relicItemService } from "../services/RelicItemService";

export const relicItemController = {
  list: (_req: Request, res: Response) => res.json(relicItemService.list()),
  create: (req: Request, res: Response) => res.status(201).json(relicItemService.create(req.body)),

  updateCondition: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(relicItemService.updateCondition(Number(req.params.id), String(req.body?.current_condition)));
    } catch (error) {
      next(error);
    }
  }
};
