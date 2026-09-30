import type { Workstation } from "../models/Workstation";
import type { ScheduleRequest } from "../models/ScheduleRequest";

const minutesOf = (isoOrTime: string) => {
  // Accepts both "HH:MM" window bounds and full ISO timestamps.
  const time = isoOrTime.includes("T") ? isoOrTime.slice(11, 16) : isoOrTime.slice(0, 5);
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

export const isWithinWindow = (workstation: Workstation, startAt: string, endAt: string): boolean => {
  const open = minutesOf(workstation.open_from);
  const close = minutesOf(workstation.open_until);
  return minutesOf(startAt) >= open && minutesOf(endAt) <= close && minutesOf(startAt) < minutesOf(endAt);
};

export const overlaps = (startA: string, endA: string, startB: string, endB: string): boolean =>
  new Date(startA) < new Date(endB) && new Date(startB) < new Date(endA);

export const countOverlappingConfirmed = (
  confirmed: ScheduleRequest[],
  startAt: string,
  endAt: string
): number => confirmed.filter((row) => overlaps(startAt, endAt, row.start_at, row.end_at)).length;

export const findOccupant = (
  confirmed: ScheduleRequest[],
  startAt: string,
  endAt: string
): ScheduleRequest | undefined =>
  confirmed.find((row) => overlaps(startAt, endAt, row.start_at, row.end_at));
