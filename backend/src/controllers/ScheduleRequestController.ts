import type { Request, Response, NextFunction } from "express";
import { scheduleRequestService } from "../services/ScheduleRequestService";

const actorId = (req: Request) => (req as unknown as { user: { id: number } }).user.id;

export const scheduleRequestController = {
  list: (_req: Request, res: Response) => res.json(scheduleRequestService.list()),

  request: (req: Request, res: Response, next: NextFunction) =>
    scheduleRequestService
      .request(req.body, actorId(req))
      .then((row) => res.status(201).json(row))
      .catch(next),

  retry: (req: Request, res: Response, next: NextFunction) =>
    scheduleRequestService
      .retry(Number(req.params.id))
      .then((row) => res.json(row))
      .catch(next)
};
