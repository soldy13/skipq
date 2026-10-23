import { drinkById } from '../data/drinks';
import { addDays, dayKey, isoWeekday, isWeekday, startOfDay, startOfMonth } from './time';
import type { DrinkId, Order } from './types';

function pickedUpThisMonth(orders: readonly Order[], now: number): Order[] {
  const from = startOfMonth(now);
  return orders.filter((o) => o.pickedUpAt !== null && o.pickedUpAt >= from && o.pickedUpAt <= now);
}

export function coffeesThisMonth(orders: readonly Order[], now: number): number {
  return pickedUpThisMonth(orders, now).length;
}

export function caffeineThisMonth(orders: readonly Order[], now: number): number {
  return pickedUpThisMonth(orders, now).reduce((sum, o) => sum + drinkById(o.config.drinkId).caffeineMg, 0);
}

export function favouriteDrink(orders: readonly Order[], now: number): DrinkId | null {
  const counts = new Map<DrinkId, number>();
  for (const o of pickedUpThisMonth(orders, now)) counts.set(o.config.drinkId, (counts.get(o.config.drinkId) ?? 0) + 1);
  let best: DrinkId | null = null;
  let bestCount = 0;
  for (const [id, n] of counts) {
    if (n > bestCount) {
      best = id;
      bestCount = n;
    }
  }
  return best;
}

/**
 * Consecutive weekdays with at least one picked-up coffee, ending today — or yesterday, so the streak
 * isn't shown as broken before the first coffee of the day. Weekends neither count nor break it.
 */
export function streak(orders: readonly Order[], now: number): number {
  const days = new Set(orders.filter((o) => o.pickedUpAt !== null && o.pickedUpAt <= now).map((o) => dayKey(o.pickedUpAt as number)));
  let cursor = startOfDay(now);
  if (!days.has(dayKey(cursor))) cursor = addDays(cursor, -1);
  let count = 0;
  for (let guard = 0; guard < 400; guard += 1) {
    if (!isWeekday(cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (!days.has(dayKey(cursor))) break;
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export interface WeekCount {
  /** Monday the week starts on. */
  from: number;
  count: number;
}

/** Picked-up coffees per calendar week (Monday first), the current week so far last. */
export function weeklyCounts(orders: readonly Order[], now: number, weeks = 4): WeekCount[] {
  const monday = addDays(startOfDay(now), 1 - isoWeekday(now));
  return Array.from({ length: weeks }, (_, i) => {
    const from = addDays(monday, -7 * (weeks - 1 - i));
    const to = addDays(from, 7);
    const count = orders.filter((o) => o.pickedUpAt !== null && o.pickedUpAt >= from && o.pickedUpAt < to && o.pickedUpAt <= now).length;
    return { from, count };
  });
}
