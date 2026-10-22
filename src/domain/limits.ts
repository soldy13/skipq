import { startOfDay } from './time';
import type { GiftCode, Order, Plan } from './types';

export interface DailyLimitInput {
  plan: Plan | null;
  orders: readonly Order[];
  gifts: readonly GiftCode[];
  nickname: string | null;
  now: number;
  /** Demo "reset today's limit": only count plan use after this moment. */
  resetAt: number | null;
}

export interface DailyLimit {
  used: number;
  max: number;
  remaining: number;
  reached: boolean;
}

/**
 * Plan allowance used today (brief §4.3). Gifts the user paid for with the plan count too.
 * Resets at local midnight of the simulated clock.
 */
export function dailyLimit({ plan, orders, gifts, nickname, now, resetAt }: DailyLimitInput): DailyLimit {
  const max = plan?.perDay ?? 0;
  const since = Math.max(startOfDay(now), resetAt ?? 0);
  const inWindow = (t: number) => t >= since && t <= now;
  const fromOrders = orders.filter((o) => o.payment === 'plan' && o.cancelledAt === null && inWindow(o.paidAt)).length;
  const fromGifts = gifts.filter(
    (g) => g.payment === 'plan' && g.fromNickname === nickname && inWindow(g.createdAt),
  ).length;
  const used = plan ? fromOrders + fromGifts : 0;
  const remaining = Math.max(0, max - used);
  return { used, max, remaining, reached: plan !== null && remaining === 0 };
}
