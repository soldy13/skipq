import { RAJSKA } from '../data/machines';
import { orderStatus } from './orders';
import type { Order } from './types';

/** An in-app, push-style notification (brief §4.5). */
export interface Notice {
  id: string;
  kind: 'ready';
  orderId: string;
  at: number;
}

/**
 * Orders that are ready right now and haven't been announced yet. An order the clock jumped straight past
 * is expired, not ready, so it is never announced late.
 */
export function readyToNotify(orders: readonly Order[], notified: readonly string[], now: number, brewMinutes = RAJSKA.brewMinutes): string[] {
  const seen = new Set(notified);
  return orders.filter((o) => !seen.has(o.id) && orderStatus(o, now, brewMinutes) === 'ready').map((o) => o.id);
}
