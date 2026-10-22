import { describe, expect, it } from 'vitest';
import { cancelOrder, canExtend, extendOrder, isOptionLocked, paymentOptions, pickUpOrder, placeOrder } from './ordering';
import { buildSeed } from '../data/seed';
import { RAJSKA } from '../data/machines';
import { DEMO_START } from './clock';
import { MINUTE, atClock } from './time';
import { orderStatus } from './orders';
import type { DrinkConfig, Order, World } from './types';

const now = DEMO_START; // Thu 09:58
const at = (hhmm: string) => atClock(now, hhmm);
const fwOat: DrinkConfig = { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' };
const fwCow: DrinkConfig = { drinkId: 'flatwhite', milk: 'cow', bean: 'standard' };
const lungo: DrinkConfig = { drinkId: 'lungo', milk: null, bean: 'standard' };

const frederika = () => buildSeed('frederika', now);
const tomas = () => buildSeed('tomas', now);

function placed(result: ReturnType<typeof placeOrder>): { world: World; order: Order } {
  if (!result.ok) throw new Error(`expected ok, got ${result.reason}`);
  return result;
}

describe('payment options', () => {
  it('offers the plan first while the allowance lasts', () => {
    const opts = paymentOptions(frederika(), fwOat, now);
    expect(opts.default).toBe('plan');
    expect(opts.options.map((o) => [o.method, o.available])).toEqual([
      ['plan', true],
      ['single', true],
    ]);
    expect(opts.options[0]).toMatchObject({ used: 2, max: 3 });
  });

  it('disables the plan at the limit and falls back to a single', () => {
    const w = frederika();
    const { world } = placed(placeOrder(w, { config: fwCow, slotStart: null, payment: 'plan' }, now, 'x1'));
    const opts = paymentOptions(world, fwCow, now);
    expect(opts.options[0]).toMatchObject({ method: 'plan', available: false, reason: 'limit' });
    expect(opts.default).toBe('single');
  });

  it('does not cover milk drinks on the Black plan', () => {
    const w: World = { ...frederika(), plan: { type: 'black', perDay: 3 } };
    const opts = paymentOptions(w, fwCow, now);
    expect(opts.options[0]).toMatchObject({ method: 'plan', available: false, reason: 'notCovered' });
    expect(opts.default).toBe('single');
    expect(paymentOptions(w, lungo, now).default).toBe('plan');
  });

  it('offers the pack with its credits when there is no plan', () => {
    const opts = paymentOptions(tomas(), lungo, now);
    expect(opts.options.map((o) => o.method)).toEqual(['pack', 'single']);
    expect(opts.options[0]).toMatchObject({ credits: 7 });
    expect(opts.default).toBe('pack');
  });

  it('counts returned gift credits as pack credits', () => {
    const w: World = { ...buildSeed('new', now), wallet: { packCredits: 0, giftCredits: 1 } };
    expect(paymentOptions(w, lungo, now).options[0]).toMatchObject({ method: 'pack', credits: 1 });
  });

  it('offers only a single to someone with nothing prepaid', () => {
    const opts = paymentOptions(buildSeed('new', now), lungo, now);
    expect(opts.options.map((o) => o.method)).toEqual(['single']);
  });
});

describe('option locks', () => {
  const none = { premium: false, adaptogenic: false, altMilk: false };
  it('needs the Alternative milk add-on for oat or soy on the plan only', () => {
    expect(isOptionLocked({ kind: 'milk', value: 'oat' }, 'plan', none)).toBe(true);
    expect(isOptionLocked({ kind: 'milk', value: 'oat' }, 'single', none)).toBe(false);
    expect(isOptionLocked({ kind: 'milk', value: 'cow' }, 'plan', none)).toBe(false);
    expect(isOptionLocked({ kind: 'milk', value: 'soy' }, 'plan', { ...none, altMilk: true })).toBe(false);
  });

  it('needs the add-on for premium or adaptogenic beans whatever the payment', () => {
    expect(isOptionLocked({ kind: 'bean', value: 'premium' }, 'single', none)).toBe(true);
    expect(isOptionLocked({ kind: 'bean', value: 'adaptogenic' }, 'pack', { ...none, adaptogenic: true })).toBe(false);
    expect(isOptionLocked({ kind: 'bean', value: 'standard' }, 'plan', none)).toBe(false);
  });
});

describe('placing an order', () => {
  it('brews Now: ready in 2 minutes, held 15 more', () => {
    const { order, world } = placed(placeOrder(frederika(), { config: fwOat, slotStart: null, payment: 'plan' }, now, 'n1'));
    expect(order).toMatchObject({ paidAt: now, slotStart: null, readyAt: now + 2 * MINUTE, holdUntil: now + 17 * MINUTE, payment: 'plan', pricePaid: 0 });
    expect(world.orders.at(-1)).toEqual(order);
    expect(orderStatus(order, now, RAJSKA.brewMinutes)).toBe('brewing');
  });

  it('is ready at slot start and held to slot end', () => {
    const { order } = placed(placeOrder(frederika(), { config: fwOat, slotStart: at('10:30'), payment: 'plan' }, now, 's1'));
    expect(order).toMatchObject({ readyAt: at('10:30'), holdUntil: at('10:45') });
    expect(orderStatus(order, now, RAJSKA.brewMinutes)).toBe('scheduled');
  });

  it('reserves a box nobody else holds', () => {
    const w = frederika();
    const { order } = placed(placeOrder(w, { config: fwOat, slotStart: null, payment: 'plan' }, now, 'b1'));
    const taken = new Set(w.traffic.map((b) => b.boxId));
    expect(taken.has(order.boxId)).toBe(false);
    expect(order.boxId).not.toBe(14);
  });

  it('spends a pack credit, gift credits first', () => {
    const w: World = { ...tomas(), wallet: { packCredits: 7, giftCredits: 1 } };
    const first = placed(placeOrder(w, { config: lungo, slotStart: null, payment: 'pack' }, now, 'p1'));
    expect(first.order.payment).toBe('giftCredit');
    expect(first.world.wallet).toEqual({ packCredits: 7, giftCredits: 0 });
    const second = placed(placeOrder(first.world, { config: lungo, slotStart: at('10:30'), payment: 'pack' }, now, 'p2'));
    expect(second.order.payment).toBe('pack');
    expect(second.world.wallet.packCredits).toBe(6);
  });

  it('takes a slot beyond the visible grid, e.g. the next free one', () => {
    const { order } = placed(placeOrder(frederika(), { config: fwCow, slotStart: at('14:30'), payment: 'single' }, now, 'g1'));
    expect(order.readyAt).toBe(at('14:30'));
  });

  it('charges 29 Kč for a single', () => {
    const { order } = placed(placeOrder(buildSeed('new', now), { config: lungo, slotStart: null, payment: 'single' }, now, 'c1'));
    expect(order).toMatchObject({ payment: 'single', pricePaid: 29 });
  });

  it('refuses what the rules do not allow', () => {
    const w = frederika();
    expect(placeOrder({ ...w, wallet: { packCredits: 0, giftCredits: 0 } }, { config: fwOat, slotStart: null, payment: 'pack' }, now, 'r1')).toMatchObject({ ok: false, reason: 'noCredits' });
    expect(placeOrder({ ...w, plan: { type: 'black', perDay: 1 } }, { config: fwCow, slotStart: null, payment: 'plan' }, now, 'r2')).toMatchObject({ ok: false, reason: 'notCovered' });
    expect(placeOrder({ ...w, addons: { ...w.addons, altMilk: false } }, { config: fwOat, slotStart: null, payment: 'plan' }, now, 'r3')).toMatchObject({ ok: false, reason: 'locked' });
    const closed = atClock(now, '19:30');
    expect(placeOrder(w, { config: fwCow, slotStart: null, payment: 'single' }, closed, 'r4')).toMatchObject({ ok: false, reason: 'closed' });
    expect(placeOrder(w, { config: fwCow, slotStart: at('09:00'), payment: 'single' }, now, 'r5')).toMatchObject({ ok: false, reason: 'slot' });
  });

  it('refuses the plan once today’s allowance is used', () => {
    const w = frederika();
    const { world } = placed(placeOrder(w, { config: fwCow, slotStart: null, payment: 'plan' }, now, 'l1'));
    expect(placeOrder(world, { config: fwCow, slotStart: null, payment: 'plan' }, now, 'l2')).toMatchObject({ ok: false, reason: 'limit' });
  });

  it('refuses a slot with no free box', () => {
    const w = frederika();
    const full = Array.from({ length: 30 }, (_, i) => ({ id: `f${i}`, boxId: i + 1, bookedAt: at('10:30'), needFrom: at('10:30'), until: at('10:45'), releasedAt: null }));
    expect(placeOrder({ ...w, traffic: full }, { config: fwCow, slotStart: at('10:30'), payment: 'single' }, now, 'f1')).toMatchObject({ ok: false, reason: 'full' });
  });
});

describe('undo, pickup, extend', () => {
  it('undo cancels and refunds a pack credit', () => {
    const { world, order } = placed(placeOrder(tomas(), { config: lungo, slotStart: null, payment: 'pack' }, now, 'u1'));
    const undone = cancelOrder(world, order.id, now + 3000);
    expect(undone.wallet.packCredits).toBe(7);
    expect(undone.orders.find((o) => o.id === 'u1')?.cancelledAt).toBe(now + 3000);
  });

  it('undo gives the plan allowance back', () => {
    const { world, order } = placed(placeOrder(frederika(), { config: fwCow, slotStart: null, payment: 'plan' }, now, 'u2'));
    expect(paymentOptions(world, fwCow, now).options[0]).toMatchObject({ available: false });
    expect(paymentOptions(cancelOrder(world, order.id, now), fwCow, now).options[0]).toMatchObject({ available: true, used: 2 });
  });

  it('only unlocks a ready coffee', () => {
    const { world, order } = placed(placeOrder(frederika(), { config: fwOat, slotStart: null, payment: 'plan' }, now, 'k1'));
    expect(pickUpOrder(world, order.id, now)).toBe(world); // still brewing
    const later = now + 3 * MINUTE;
    const done = pickUpOrder(world, order.id, later);
    expect(done.orders.find((o) => o.id === 'k1')?.pickedUpAt).toBe(later);
  });

  it('extends a ready coffee once, when the next slot has room', () => {
    const w = frederika();
    const ready = at('10:16'); // seeded flat white for 10:15, held to 10:30
    expect(canExtend(w, 'o_frederika_active', ready)).toBe(true);
    const extended = extendOrder(w, 'o_frederika_active', ready);
    const order = extended.orders.find((o) => o.id === 'o_frederika_active');
    expect(order).toMatchObject({ holdUntil: at('10:45'), extended: true });
    expect(canExtend(extended, 'o_frederika_active', ready)).toBe(false);
  });

  it('does not extend before the coffee is ready', () => {
    expect(canExtend(frederika(), 'o_frederika_active', now)).toBe(false);
  });

  it('does not extend into a full slot', () => {
    const w = frederika();
    const full = Array.from({ length: 30 }, (_, i) => ({ id: `f${i}`, boxId: i + 1, bookedAt: at('10:30'), needFrom: at('10:30'), until: at('10:45'), releasedAt: null }));
    expect(canExtend({ ...w, traffic: full }, 'o_frederika_active', at('10:16'))).toBe(false);
  });
});
