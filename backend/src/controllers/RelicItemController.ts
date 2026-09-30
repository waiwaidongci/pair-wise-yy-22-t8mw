import type { Request, Response, NextFunction } from "express";
import { relicItemService } from "../services/RelicItemService";

export const relicItemController = {
  list: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(relicItemService.list());
    } catch (e) {
      next(e);
    }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(relicItemService.create(req.body));
    } catch (e) {
      next(e);
    }
  },
  update: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(relicItemService.update(Number(req.params.id), req.body));
    } catch (e) {
      next(e);
    }
  }
};
