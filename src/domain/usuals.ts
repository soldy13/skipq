import type { DrinkConfig, Order } from './types';

export interface Usual {
  config: DrinkConfig;
  count: number;
  lastAt: number;
}

export function configKey(c: DrinkConfig): string {
  return `${c.drinkId}|${c.milk ?? '-'}|${c.bean}`;
}

/** Top configurations (drink + milk + bean) by order count; ties go to the most recent. Brief §4.6. */
export function topUsuals(orders: readonly Order[], limit = 3): Usual[] {
  const byKey = new Map<string, Usual>();
  for (const o of orders) {
    if (o.cancelledAt !== null) continue;
    const key = configKey(o.config);
    const prev = byKey.get(key);
    byKey.set(key, {
      config: prev?.config ?? o.config,
      count: (prev?.count ?? 0) + 1,
      lastAt: Math.max(prev?.lastAt ?? 0, o.paidAt),
    });
  }
  return [...byKey.values()].sort((a, b) => b.count - a.count || b.lastAt - a.lastAt).slice(0, limit);
}
