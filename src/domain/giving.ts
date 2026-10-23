import { RAJSKA, type MachineConfig } from '../data/machines';
import { drinkById } from '../data/drinks';
import { GIFT_VALID_DAYS } from '../data/pricing';
import { paymentFailure, reserveOrder, settle, type PaymentChoice, type PlaceFailure, type PlaceResult } from './ordering';
import { addDays } from './time';
import type { DrinkConfig, GiftCode, Milk, World } from './types';

export interface GiftRequest {
  config: DrinkConfig;
  payment: PaymentChoice;
  /** Optional first name for the notice if the gift comes back. */
  toName: string | null;
}

export type SendResult = { ok: true; world: World; gift: GiftCode } | { ok: false; reason: PlaceFailure };
export type RedeemError = 'unknown' | 'redeemed' | 'expired' | 'own';
export type CheckResult = { ok: true; gift: GiftCode } | { ok: false; error: RedeemError };
export type RedeemResult = PlaceResult | { ok: false; reason: RedeemError };

const MAX_NAME = 24;

function cleanName(name: string | null): string | null {
  const trimmed = name?.trim().slice(0, MAX_NAME) ?? '';
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Gift a coffee (brief §4.7): paid like an order — a plan gift counts toward the sender's daily limit —
 * and handed over as a code valid for five days.
 */
export function sendGift(world: World, req: GiftRequest, now: number, code: string): SendResult {
  const fail = paymentFailure(world, req, now);
  if (fail) return { ok: false, reason: fail };
  const paid = settle(world, req.payment);
  const gift: GiftCode = {
    code,
    config: req.config,
    fromNickname: world.profile.nickname ?? '',
    toName: cleanName(req.toName),
    createdAt: now,
    expiresAt: addDays(now, GIFT_VALID_DAYS),
    payment: paid.method,
    redeemedBy: null,
    redeemedAt: null,
    returnedAt: null,
  };
  return { ok: true, gift, world: { ...world, wallet: paid.wallet, gifts: [...world.gifts, gift] } };
}

/** Why a typed code can't be redeemed, in the order a student would want to hear it. */
export function checkRedeem(world: World, code: string, now: number): CheckResult {
  const gift = world.gifts.find((g) => g.code === code);
  if (!gift) return { ok: false, error: 'unknown' };
  if (gift.redeemedBy !== null) return { ok: false, error: 'redeemed' };
  if (gift.fromNickname === world.profile.nickname) return { ok: false, error: 'own' };
  if (gift.returnedAt !== null || now >= gift.expiresAt) return { ok: false, error: 'expired' };
  return { ok: true, gift };
}

/**
 * Redeem: the gifted drink becomes a normal order — no payment, and it doesn't touch the receiver's daily
 * limit. The receiver may change the milk but not the drink (brief §12.6).
 */
export function redeemGift(
  world: World,
  code: string,
  choice: { milk: Milk | null; slotStart: number | null },
  now: number,
  id: string,
  machine: MachineConfig = RAJSKA,
): RedeemResult {
  const check = checkRedeem(world, code, now);
  if (!check.ok) return { ok: false, reason: check.error };
  const isMilk = drinkById(check.gift.config.drinkId).type === 'milk';
  const config: DrinkConfig = { ...check.gift.config, milk: isMilk ? (choice.milk ?? check.gift.config.milk) : null };
  const result = reserveOrder(world, config, choice.slotStart, now, id, { method: 'gift', pricePaid: 0, wallet: world.wallet }, machine);
  if (!result.ok) return result;
  const gifts = result.world.gifts.map((g) => (g.code === code ? { ...g, redeemedBy: world.profile.nickname ?? '', redeemedAt: now } : g));
  return { ...result, world: { ...result.world, gifts } };
}

/**
 * The user's gifts that expired unredeemed come back as one gift credit each (brief §4.7). Idempotent:
 * returns the same world when nothing is due.
 */
export function returnExpiredGifts(world: World, now: number): { world: World; returned: GiftCode[] } {
  const due = world.gifts.filter((g) => g.fromNickname === world.profile.nickname && g.redeemedBy === null && g.returnedAt === null && now >= g.expiresAt);
  if (due.length === 0) return { world, returned: [] };
  const codes = new Set(due.map((g) => g.code));
  const gifts = world.gifts.map((g) => (codes.has(g.code) ? { ...g, returnedAt: g.expiresAt } : g));
  return {
    world: { ...world, gifts, wallet: { ...world.wallet, giftCredits: world.wallet.giftCredits + due.length } },
    returned: due.map((g) => ({ ...g, returnedAt: g.expiresAt })),
  };
}
