import { describe, expect, it } from 'vitest';
import { buildSeed, buildTraffic } from './seed';
import { RAJSKA } from './machines';
import { LEADERBOARD } from './leaderboard';
import { DEMO_START } from '../domain/clock';
import { boxesInUseAt } from '../domain/boxes';
import { dailyLimit } from '../domain/limits';
import { orderBooking, orderStatus } from '../domain/orders';
import { topUsuals } from '../domain/usuals';
import { caffeineThisMonth, coffeesThisMonth, streak } from '../domain/stats';
import { giftStatus } from '../domain/gifts';
import { addDays } from '../domain/time';

const now = DEMO_START;

function allBookings(seed: ReturnType<typeof buildSeed>) {
  return [...seed.traffic, ...seed.orders.map(orderBooking)];
}

describe('Frederika (default persona)', () => {
  const seed = buildSeed('frederika', now);

  it('is on the Milk plan, up to 3 a day, with Premium beans and Alternative milk', () => {
    expect(seed.plan).toEqual({ type: 'milk', perDay: 3 });
    expect(seed.addons).toEqual({ premium: true, adaptogenic: false, altMilk: true });
    expect(seed.profile).toMatchObject({ nickname: 'frederika_k', displayName: 'Frederika', onboarded: true });
  });

  it('shows 12 of 30 boxes free, counting her own order', () => {
    expect(boxesInUseAt(allBookings(seed), now).size).toBe(18);
  });

  it('has one active order in box 14', () => {
    const active = seed.orders.filter((o) => orderStatus(o, now, RAJSKA.brewMinutes) === 'scheduled');
    expect(active).toHaveLength(1);
    expect(active[0]?.boxId).toBe(14);
  });

  it('has used 2 of 3 today', () => {
    const limit = dailyLimit({ plan: seed.plan, orders: seed.orders, gifts: seed.gifts, nickname: 'frederika_k', now, resetAt: null });
    expect(limit).toMatchObject({ used: 2, max: 3 });
  });

  it('has the usuals from the brief', () => {
    expect(topUsuals(seed.orders).map((u) => [u.config.drinkId, u.config.milk, u.count])).toEqual([
      ['flatwhite', 'oat', 23],
      ['cappuccino', 'cow', 14],
      ['americano', null, 9],
    ]);
  });

  it('has 31 coffees this month and a 6-day streak', () => {
    expect(coffeesThisMonth(seed.orders, now)).toBe(31);
    expect(streak(seed.orders, now)).toBe(6);
  });

  it('has a plausible caffeine total for her mix', () => {
    const mg = caffeineThisMonth(seed.orders, now);
    expect(mg).toBeGreaterThan(2000);
    expect(mg).toBeLessThan(3500);
  });

  it('has one sent gift that expires in a day', () => {
    const mine = seed.gifts.filter((g) => g.fromNickname === 'frederika_k');
    expect(mine.map((g) => g.code)).toEqual(['SKQ-4H7P']);
    expect(mine[0]?.expiresAt).toBe(addDays(now, 1));
    expect(giftStatus(mine[0]!, now)).toBe('pending');
  });

  it('never double-books a box', () => {
    const inUse = allBookings(seed).filter((b) => b.bookedAt <= now && now < b.until);
    expect(new Set(inUse.map((b) => b.boxId)).size).toBe(inUse.length);
  });
});

describe('Tomáš', () => {
  const seed = buildSeed('tomas', now);

  it('pays per pack with 7 credits and no plan', () => {
    expect(seed.plan).toBeNull();
    expect(seed.wallet.packCredits).toBe(7);
  });

  it('drinks lungo and espresso', () => {
    expect(topUsuals(seed.orders).map((u) => [u.config.drinkId, u.count])).toEqual([
      ['lungo', 12],
      ['espresso', 5],
    ]);
  });

  it('sees 13 free boxes (no order of his own)', () => {
    expect(boxesInUseAt(allBookings(seed), now).size).toBe(17);
  });
});

describe('New user', () => {
  const seed = buildSeed('new', now);

  it('starts empty and not onboarded', () => {
    expect(seed.orders).toEqual([]);
    expect(seed.profile).toMatchObject({ nickname: null, onboarded: false });
    expect(seed.plan).toBeNull();
  });
});

describe('shared world', () => {
  const seed = buildSeed('frederika', now);

  it('seeds the redeemable and the already-redeemed gift codes', () => {
    const byCode = new Map(seed.gifts.map((g) => [g.code, g]));
    const raccoon = byCode.get('SKQ-7M4T');
    expect(raccoon).toMatchObject({ fromNickname: 'rajska_raccoon', expiresAt: addDays(now, 3) });
    expect(raccoon?.config.drinkId).toBe('cappuccino');
    expect(giftStatus(byCode.get('SKQ-2KQX')!, now)).toBe('redeemed');
  });

  it('is deterministic', () => {
    expect(buildSeed('frederika', now)).toEqual(seed);
  });

  it('spreads anonymous traffic across the next hour', () => {
    const traffic = buildTraffic(now, new Set([14]));
    expect(traffic).toHaveLength(17);
    expect(traffic.every((b) => b.boxId !== 14)).toBe(true);
    expect(Math.max(...traffic.map((b) => b.until)) - now).toBeLessThanOrEqual(65 * 60_000);
  });

  it('ranks frederika_k #12 of 20 on the coffee board', () => {
    expect(LEADERBOARD).toHaveLength(20);
    const sorted = [...LEADERBOARD].sort((a, b) => b.coffees - a.coffees);
    expect(sorted.findIndex((u) => u.nickname === 'frederika_k')).toBe(11);
    expect(LEADERBOARD.every((u) => u.coffees >= 10 && u.coffees <= 61)).toBe(true);
  });
});
