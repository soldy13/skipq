import type { MachineConfig } from '../data/machines';
import { boxesBusyDuring } from './boxes';
import { addDays, atClock, isoWeekday, MINUTE, startOfDay } from './time';
import type { Booking } from './types';

export type SlotState = 'open' | 'few' | 'full';

export interface SlotInfo {
  /** Slot start; null for Now. */
  start: number | null;
  /** Window in which a box must be free. */
  from: number;
  to: number;
  free: number;
  state: SlotState;
}

export interface NowInfo extends SlotInfo {
  start: null;
  /** False when the machine is closed. */
  available: boolean;
}

export interface SlotGrid {
  now: NowInfo;
  slots: SlotInfo[];
}

/** Searching for "next free slot" gives up after this many days. */
const SEARCH_DAYS = 7;

function isOpenDay(machine: MachineConfig, t: number): boolean {
  return machine.days.includes(isoWeekday(t));
}

export function isOpenAt(machine: MachineConfig, t: number): boolean {
  return isOpenDay(machine, t) && t >= atClock(t, machine.open) && t < atClock(t, machine.close);
}

/** Can a Now order still be brewed before closing? */
function nowAvailable(machine: MachineConfig, now: number): boolean {
  return isOpenAt(machine, now) && now + machine.brewMinutes * MINUTE <= atClock(now, machine.close);
}

/** All slot starts on the day of `day` whose brewing would start after `now`. */
function dayStarts(machine: MachineConfig, day: number, now: number): number[] {
  if (!isOpenDay(machine, day)) return [];
  const step = machine.slotMinutes * MINUTE;
  const brew = machine.brewMinutes * MINUTE;
  const close = atClock(day, machine.close);
  const out: number[] = [];
  for (let s = atClock(day, machine.open); s + step <= close; s += step) {
    if (s - brew > now) out.push(s);
  }
  return out;
}

/** A future slot start on the opening-hours grid of an opening day (not limited to the visible eight). */
export function isValidSlotStart(machine: MachineConfig, now: number, start: number): boolean {
  return dayStarts(machine, startOfDay(start), now).includes(start);
}

/**
 * The next `gridSlots` slots on one opening day: today if any slot is left, otherwise the next opening day.
 * The grid never mixes two days.
 */
export function slotStartsFor(machine: MachineConfig, now: number): number[] {
  for (let i = 0; i <= SEARCH_DAYS; i += 1) {
    const starts = dayStarts(machine, addDays(startOfDay(now), i), now);
    if (starts.length > 0) return starts.slice(0, machine.gridSlots);
  }
  return [];
}

function slotState(machine: MachineConfig, free: number): SlotState {
  if (free <= 0) return 'full';
  return free <= machine.fewThreshold ? 'few' : 'open';
}

/** A slot needs its box from slot start (coffee ready) to slot end (hold), so neighbouring slots never overlap. */
function slotInfo(machine: MachineConfig, bookings: readonly Booking[], now: number, start: number): SlotInfo {
  const from = start;
  const to = start + machine.slotMinutes * MINUTE;
  const free = machine.boxes - boxesBusyDuring(bookings, from, to, now).size;
  return { start, from, to, free, state: slotState(machine, free) };
}

export function buildSlotGrid(machine: MachineConfig, now: number, bookings: readonly Booking[]): SlotGrid {
  const available = nowAvailable(machine, now);
  const nowFrom = now + machine.brewMinutes * MINUTE;
  const nowTo = nowFrom + machine.slotMinutes * MINUTE;
  const nowFree = available ? machine.boxes - boxesBusyDuring(bookings, nowFrom, nowTo, now).size : 0;
  return {
    now: { start: null, from: nowFrom, to: nowTo, free: nowFree, state: slotState(machine, nowFree), available },
    slots: slotStartsFor(machine, now).map((s) => slotInfo(machine, bookings, now, s)),
  };
}

/** First slot start with at least one free box, looking up to a week ahead. */
export function nextFreeSlot(machine: MachineConfig, now: number, bookings: readonly Booking[]): number | null {
  for (let i = 0; i <= SEARCH_DAYS; i += 1) {
    for (const s of dayStarts(machine, addDays(startOfDay(now), i), now)) {
      if (slotInfo(machine, bookings, now, s).free > 0) return s;
    }
  }
  return null;
}
