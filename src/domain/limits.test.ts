import { describe, expect, it } from 'vitest';
import { dailyLimit } from './limits';
import type { GiftCode, Order, Plan } from './types';

const at = (h: number, m: number, day = 22) => new Date(2026, 9, day, h, m).getTime();
const plan: Plan = { type: 'milk', perDay: 3 };

function order(paidAt: number, over: Partial<Order> = {}): Order {
  return {
    id: `o${paidAt}`,
    config: { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' },
    machineId: 'vse-rb-1',
    boxId: 1,
    paidAt,
    slotStart: null,
    readyAt: paidAt,
    holdUntil: paidAt,
    extended: false,
    payment: 'plan',
    pricePaid: 0,
    pickedUpAt: null,
    cancelledAt: null,
    ...over,
  };
}

function gift(createdAt: number, over: Partial<GiftCode> = {}): GiftCode {
  return {
    code: 'SKQ-AAAA',
    config: { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' },
    fromNickname: 'frederika_k',
    createdAt,
    expiresAt: createdAt + 5 * 86_400_000,
    payment: 'plan',
    redeemedBy: null,
    redeemedAt: null,
    returnedAt: null,
    ...over,
  };
}

describe('daily limit', () => {
  it('counts today’s plan orders only', () => {
    const orders = [order(at(8, 0)), order(at(9, 0)), order(at(9, 30, 21)), order(at(9, 40), { payment: 'single' })];
    const limit = dailyLimit({ plan, orders, gifts: [], nickname: 'frederika_k', now: at(10, 0), resetAt: null });
    expect(limit).toMatchObject({ used: 2, max: 3, reached: false, remaining: 1 });
  });

  it('counts gifts the user paid for with the plan', () => {
    const limit = dailyLimit({
      plan,
      orders: [order(at(8, 0)), order(at(9, 0))],
      gifts: [gift(at(9, 30)), gift(at(9, 31), { fromNickname: 'someone_else' }), gift(at(9, 32), { payment: 'single' })],
      nickname: 'frederika_k',
      now: at(10, 0),
      resetAt: null,
    });
    expect(limit).toMatchObject({ used: 3, reached: true, remaining: 0 });
  });

  it('does not count undone orders', () => {
    const limit = dailyLimit({
      plan,
      orders: [order(at(8, 0), { cancelledAt: at(8, 0) })],
      gifts: [],
      nickname: 'frederika_k',
      now: at(10, 0),
      resetAt: null,
    });
    expect(limit.used).toBe(0);
  });

  it('resets at midnight', () => {
    const orders = [order(at(8, 0)), order(at(9, 0)), order(at(9, 30))];
    const limit = dailyLimit({ plan, orders, gifts: [], nickname: 'frederika_k', now: at(0, 1, 23), resetAt: null });
    expect(limit.used).toBe(0);
  });

  it('honours a demo reset during the day', () => {
    const orders = [order(at(8, 0)), order(at(9, 0)), order(at(9, 30))];
    const limit = dailyLimit({ plan, orders, gifts: [], nickname: 'frederika_k', now: at(10, 0), resetAt: at(9, 45) });
    expect(limit.used).toBe(0);
  });

  it('has no allowance without a plan', () => {
    const limit = dailyLimit({ plan: null, orders: [], gifts: [], nickname: 'x', now: at(10, 0), resetAt: null });
    expect(limit).toMatchObject({ used: 0, max: 0, reached: false });
  });
});
