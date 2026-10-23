import { describe, expect, it } from 'vitest';
import { checkRedeem, redeemGift, returnExpiredGifts, sendGift } from './giving';
import { dailyLimit } from './limits';
import { orderStatus } from './orders';
import { buildSeed } from '../data/seed';
import { RAJSKA } from '../data/machines';
import { DEMO_START } from './clock';
import { addDays, atClock, MINUTE } from './time';
import { giftStatus } from './gifts';
import type { DrinkConfig, World } from './types';

const now = DEMO_START;
const cap: DrinkConfig = { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' };
const lungo: DrinkConfig = { drinkId: 'lungo', milk: null, bean: 'standard' };
const frederika = () => buildSeed('frederika', now);
const tomas = () => buildSeed('tomas', now);
const limit = (w: World) => dailyLimit({ plan: w.plan, orders: w.orders, gifts: w.gifts, nickname: w.profile.nickname, now, resetAt: w.limitResetAt });

describe('sending a gift', () => {
  it('issues a fresh SKQ code valid for five days', () => {
    const r = sendGift(frederika(), { config: cap, payment: 'single', toName: 'Ondra' }, now, 'SKQ-AB2C');
    if (!r.ok) throw new Error(r.reason);
    expect(r.gift).toMatchObject({ code: 'SKQ-AB2C', fromNickname: 'frederika_k', toName: 'Ondra', createdAt: now, expiresAt: addDays(now, 5), payment: 'single' });
    expect(r.world.gifts.at(-1)).toEqual(r.gift);
  });

  it('counts toward the sender’s daily limit when paid with the plan', () => {
    const w = frederika();
    expect(limit(w).used).toBe(2);
    const r = sendGift(w, { config: cap, payment: 'plan', toName: null }, now, 'SKQ-PL4N');
    if (!r.ok) throw new Error(r.reason);
    expect(limit(r.world)).toMatchObject({ used: 3, reached: true });
  });

  it('spends a pack credit', () => {
    const r = sendGift(tomas(), { config: lungo, payment: 'pack', toName: null }, now, 'SKQ-PACK');
    if (!r.ok) throw new Error(r.reason);
    expect(r.world.wallet.packCredits).toBe(6);
  });

  it('follows the payment rules', () => {
    expect(sendGift(tomas(), { config: lungo, payment: 'plan', toName: null }, now, 'SKQ-XXXX')).toMatchObject({ ok: false, reason: 'noPlan' });
    expect(sendGift({ ...frederika(), plan: { type: 'black', perDay: 3 } }, { config: cap, payment: 'plan', toName: null }, now, 'SKQ-XXXX')).toMatchObject({ ok: false, reason: 'notCovered' });
  });

  it('trims the optional name and drops an empty one', () => {
    const r = sendGift(frederika(), { config: cap, payment: 'single', toName: '   ' }, now, 'SKQ-NAME');
    if (!r.ok) throw new Error(r.reason);
    expect(r.gift.toName).toBeNull();
  });
});

describe('checking a code', () => {
  it('finds a pending gift from someone else', () => {
    expect(checkRedeem(frederika(), 'SKQ-7M4T', now)).toMatchObject({ ok: true, gift: { fromNickname: 'rajska_raccoon' } });
  });

  it('names every way a code can fail', () => {
    const w = frederika();
    expect(checkRedeem(w, 'SKQ-ZZZZ', now)).toEqual({ ok: false, error: 'unknown' });
    expect(checkRedeem(w, 'SKQ-2KQX', now)).toEqual({ ok: false, error: 'redeemed' });
    expect(checkRedeem(w, 'SKQ-4H7P', now)).toEqual({ ok: false, error: 'own' });
    expect(checkRedeem(w, 'SKQ-7M4T', addDays(now, 3))).toEqual({ ok: false, error: 'expired' });
  });
});

describe('redeeming a gift', () => {
  it('becomes a normal order with no payment and no limit use', () => {
    const w = frederika();
    const r = redeemGift(w, 'SKQ-7M4T', { milk: 'oat', slotStart: null }, now, 'o_gift');
    if (!r.ok) throw new Error(r.reason);
    expect(r.order).toMatchObject({ payment: 'gift', pricePaid: 0, config: { drinkId: 'cappuccino', milk: 'oat' } });
    expect(orderStatus(r.order, now, RAJSKA.brewMinutes)).toBe('brewing');
    expect(limit(r.world).used).toBe(2);
    const gift = r.world.gifts.find((g) => g.code === 'SKQ-7M4T');
    expect(gift).toMatchObject({ redeemedBy: 'frederika_k', redeemedAt: now });
  });

  it('can be picked up at a slot', () => {
    const slot = atClock(now, '10:30');
    const r = redeemGift(frederika(), 'SKQ-7M4T', { milk: 'cow', slotStart: slot }, now, 'o_gift2');
    if (!r.ok) throw new Error(r.reason);
    expect(r.order.readyAt).toBe(slot);
  });

  it('keeps black drinks black', () => {
    const w: World = { ...frederika(), gifts: [...frederika().gifts, { ...frederika().gifts[0]!, code: 'SKQ-BLAK', config: lungo }] };
    const r = redeemGift(w, 'SKQ-BLAK', { milk: 'oat', slotStart: null }, now, 'o_gift3');
    if (!r.ok) throw new Error(r.reason);
    expect(r.order.config.milk).toBeNull();
  });

  it('refuses a code that does not check out', () => {
    expect(redeemGift(frederika(), 'SKQ-2KQX', { milk: 'cow', slotStart: null }, now, 'x')).toMatchObject({ ok: false, reason: 'redeemed' });
  });
});

describe('unredeemed gifts come back', () => {
  it('returns the user’s expired gift as one gift credit', () => {
    const w = frederika(); // SKQ-4H7P expires in a day
    const later = addDays(now, 1) + MINUTE;
    const { world, returned } = returnExpiredGifts(w, later);
    expect(returned.map((g) => g.code)).toEqual(['SKQ-4H7P']);
    expect(world.wallet.giftCredits).toBe(1);
    const gift = world.gifts.find((g) => g.code === 'SKQ-4H7P')!;
    expect(gift.returnedAt).toBe(gift.expiresAt);
    expect(giftStatus(gift, later)).toBe('returned');
  });

  it('only returns once and leaves other people’s gifts alone', () => {
    const later = addDays(now, 6);
    const first = returnExpiredGifts(frederika(), later);
    expect(first.world.wallet.giftCredits).toBe(1);
    const second = returnExpiredGifts(first.world, later + MINUTE);
    expect(second.returned).toEqual([]);
    expect(second.world).toBe(first.world);
  });

  it('does nothing before expiry', () => {
    const w = frederika();
    expect(returnExpiredGifts(w, now).world).toBe(w);
  });
});
