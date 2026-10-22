import type { AddonId, PlanTier, PlanType } from '../domain/types';

/** Brief §4.1 — CZK, VAT included. */
export const SINGLE_PRICE = 29;

export interface Pack {
  size: 10 | 30 | 50;
  price: number;
}

export const PACKS: readonly Pack[] = [
  { size: 10, price: 269 },
  { size: 30, price: 749 },
  { size: 50, price: 1199 },
];

/** Weekly price per plan type and daily allowance. */
export const PLAN_PRICES: Readonly<Record<PlanType, Record<PlanTier, number>>> = {
  milk: { 1: 119, 3: 229 },
  black: { 1: 89, 3: 179 },
};

/** Monthly price per add-on. */
export const ADDON_PRICES: Readonly<Record<AddonId, number>> = {
  premium: 29,
  adaptogenic: 29,
  altMilk: 29,
};

export const ADDON_IDS: readonly AddonId[] = ['premium', 'adaptogenic', 'altMilk'];

export const GIFT_VALID_DAYS = 5;
