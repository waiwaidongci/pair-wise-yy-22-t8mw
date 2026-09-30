import type { Request, Response } from "express";
import { workstationService } from "../services/WorkstationService";

export const workstationController = {
  list: (_req: Request, res: Response) => res.json(workstationService.list()),
  create: (req: Request, res: Response) => res.status(201).json(workstationService.create(req.body))
};
