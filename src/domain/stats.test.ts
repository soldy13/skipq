import { describe, expect, it } from 'vitest';
import { caffeineThisMonth, coffeesThisMonth, favouriteDrink, streak, weeklyCounts } from './stats';
import type { DrinkId, Order } from './types';

const at = (day: number, h = 9, month = 9) => new Date(2026, month, day, h, 0).getTime();

function picked(day: number, drinkId: DrinkId = 'cappuccino', month = 9, over: Partial<Order> = {}): Order {
  const t = at(day, 9, month);
  return {
    id: `o${month}-${day}-${drinkId}-${Math.random()}`,
    config: { drinkId, milk: drinkId === 'americano' ? null : 'cow', bean: 'standard' },
    machineId: 'vse-rb-1',
    boxId: 1,
    paidAt: t,
    slotStart: null,
    readyAt: t,
    holdUntil: t,
    extended: false,
    payment: 'plan',
    pricePaid: 0,
    pickedUpAt: t,
    cancelledAt: null,
    ...over,
  };
}

const now = at(22, 10); // Thu 22 Oct

describe('personal stats', () => {
  it('counts picked-up coffees this month only', () => {
    const orders = [picked(1), picked(22), picked(30, 'cappuccino', 8), picked(22, 'latte', 9, { pickedUpAt: null })];
    expect(coffeesThisMonth(orders, now)).toBe(2);
  });

  it('sums caffeine from the drink menu', () => {
    const orders = [picked(1, 'flatwhite'), picked(2, 'cappuccino')];
    expect(caffeineThisMonth(orders, now)).toBe(130 + 65);
  });

  it('counts a weekday streak, skipping weekends', () => {
    // Thu 15, Fri 16, Mon 19, Tue 20, Wed 21, Thu 22 — gap on Wed 14.
    const orders = [13, 15, 16, 19, 20, 21, 22].map((d) => picked(d));
    expect(streak(orders, now)).toBe(6);
  });

  it('keeps yesterday’s streak alive before today’s first coffee', () => {
    const orders = [19, 20, 21].map((d) => picked(d));
    expect(streak(orders, now)).toBe(3);
  });

  it('is zero after a missed weekday', () => {
    expect(streak([picked(19)], now)).toBe(0);
  });

  it('names the most-ordered drink this month', () => {
    const orders = [picked(1, 'latte'), picked(2, 'espresso'), picked(5, 'espresso')];
    expect(favouriteDrink(orders, now)).toBe('espresso');
    expect(favouriteDrink([], now)).toBeNull();
  });

  it('buckets the last four weeks, oldest first', () => {
    const orders = [picked(22), picked(21), picked(14), picked(2)];
    const weeks = weeklyCounts(orders, now, 4);
    expect(weeks.map((w) => w.count)).toEqual([0, 1, 1, 2]);
  });
});
