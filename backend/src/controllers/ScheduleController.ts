import type { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/ScheduleService";

function actor(req: Request) {
  const user = (req as any).user ?? { id: 1, role: "guest" };
  return { id: Number(user.id), role: user.role, name: user.name };
}

export const scheduleController = {
  listSchedules: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(scheduleService.listSchedules());
    } catch (e) {
      next(e);
    }
  },
  listApplications: (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(scheduleService.listApplications());
    } catch (e) {
      next(e);
    }
  },
  createSchedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scheduleService.createSchedule(req.body, actor(req));
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },
  retryApplication: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scheduleService.retryApplication(Number(req.params.id), actor(req), req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
};
