import { describe, expect, it } from 'vitest';
import { orderBooking, orderStatus } from './orders';
import type { Order } from './types';

const at = (h: number, m: number) => new Date(2026, 9, 22, h, m).getTime();

const scheduled: Order = {
  id: 'o1',
  config: { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' },
  machineId: 'vse-rb-1',
  boxId: 14,
  paidAt: at(9, 40),
  slotStart: at(10, 15),
  readyAt: at(10, 15),
  holdUntil: at(10, 30),
  extended: false,
  payment: 'plan',
  pricePaid: 0,
  pickedUpAt: null,
  cancelledAt: null,
};

describe('order status', () => {
  it('walks scheduled → brewing → ready → expired with the clock', () => {
    expect(orderStatus(scheduled, at(10, 0), 2)).toBe('scheduled');
    expect(orderStatus(scheduled, at(10, 13), 2)).toBe('brewing');
    expect(orderStatus(scheduled, at(10, 15), 2)).toBe('ready');
    expect(orderStatus(scheduled, at(10, 29), 2)).toBe('ready');
    expect(orderStatus(scheduled, at(10, 30), 2)).toBe('expired');
  });

  it('is picked up once unlocked, whatever the time', () => {
    expect(orderStatus({ ...scheduled, pickedUpAt: at(10, 20) }, at(12, 0), 2)).toBe('pickedUp');
  });

  it('is cancelled after an undo', () => {
    expect(orderStatus({ ...scheduled, cancelledAt: at(9, 41) }, at(10, 20), 2)).toBe('cancelled');
  });
});

describe('order booking', () => {
  it('needs the box from the moment the coffee is ready until hold end', () => {
    const b = orderBooking(scheduled);
    expect(b).toMatchObject({ boxId: 14, bookedAt: at(9, 40), needFrom: at(10, 15), until: at(10, 30) });
  });

  it('releases the box at pickup or cancel', () => {
    expect(orderBooking({ ...scheduled, pickedUpAt: at(10, 17) }).releasedAt).toBe(at(10, 17));
    expect(orderBooking({ ...scheduled, cancelledAt: at(9, 41) }).releasedAt).toBe(at(9, 41));
  });

  it('keeps an extended hold', () => {
    expect(orderBooking({ ...scheduled, holdUntil: at(10, 45), extended: true }).until).toBe(at(10, 45));
    expect(orderStatus({ ...scheduled, holdUntil: at(10, 45) }, at(10, 40), 2)).toBe('ready');
  });

  it('derives brewing from the machine brew time', () => {
    expect(orderStatus(scheduled, at(10, 12), 3)).toBe('brewing');
    expect(orderStatus(scheduled, at(10, 11), 3)).toBe('scheduled');
  });
});
