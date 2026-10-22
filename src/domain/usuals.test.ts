import { describe, expect, it } from 'vitest';
import { topUsuals } from './usuals';
import type { DrinkConfig, Order } from './types';

let n = 0;
function order(config: DrinkConfig, paidAt: number, over: Partial<Order> = {}): Order {
  n += 1;
  return {
    id: `o${n}`,
    config,
    machineId: 'vse-rb-1',
    boxId: 1,
    paidAt,
    slotStart: null,
    readyAt: paidAt,
    holdUntil: paidAt,
    extended: false,
    payment: 'single',
    pricePaid: 29,
    pickedUpAt: paidAt,
    cancelledAt: null,
    ...over,
  };
}

const fw: DrinkConfig = { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' };
const fwCow: DrinkConfig = { drinkId: 'flatwhite', milk: 'cow', bean: 'standard' };
const cap: DrinkConfig = { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' };
const am: DrinkConfig = { drinkId: 'americano', milk: null, bean: 'standard' };
const esp: DrinkConfig = { drinkId: 'espresso', milk: null, bean: 'standard' };

describe('your usuals', () => {
  it('ranks configurations by order count, most frequent first', () => {
    const orders = [order(am, 1), order(fw, 2), order(fw, 3), order(cap, 4), order(fw, 5), order(cap, 6)];
    expect(topUsuals(orders).map((u) => [u.config.drinkId, u.count])).toEqual([
      ['flatwhite', 3],
      ['cappuccino', 2],
      ['americano', 1],
    ]);
  });

  it('treats a different milk as a different usual', () => {
    const orders = [order(fw, 1), order(fwCow, 2)];
    expect(topUsuals(orders)).toHaveLength(2);
  });

  it('breaks ties by the most recent order', () => {
    const orders = [order(esp, 10), order(am, 20), order(cap, 5)];
    expect(topUsuals(orders).map((u) => u.config.drinkId)).toEqual(['americano', 'espresso', 'cappuccino']);
  });

  it('ignores cancelled orders', () => {
    const orders = [order(esp, 1, { cancelledAt: 2 }), order(am, 3)];
    expect(topUsuals(orders).map((u) => u.config.drinkId)).toEqual(['americano']);
  });

  it('returns at most the requested number', () => {
    const orders = [order(esp, 1), order(am, 2), order(cap, 3), order(fw, 4)];
    expect(topUsuals(orders, 3)).toHaveLength(3);
  });
});
