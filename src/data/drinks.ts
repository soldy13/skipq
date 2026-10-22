import type { Bean, Drink, DrinkConfig, DrinkId, Milk } from '../domain/types';

/** Brief §6.1 — typical café values until the supplier's spec sheet arrives (§12.7). */
export const DRINKS: readonly Drink[] = [
  { id: 'espresso', type: 'black', name: { en: 'Espresso', cs: 'Espresso' }, sizeMl: 40, caffeineMg: 65, milkShare: '0', strength: 5 },
  { id: 'lungo', type: 'black', name: { en: 'Lungo', cs: 'Lungo' }, sizeMl: 110, caffeineMg: 80, milkShare: '0', strength: 4 },
  { id: 'americano', type: 'black', name: { en: 'Americano', cs: 'Americano' }, sizeMl: 250, caffeineMg: 65, milkShare: '0', strength: 3 },
  { id: 'flatwhite', type: 'milk', name: { en: 'Flat white', cs: 'Flat white' }, sizeMl: 160, caffeineMg: 130, milkShare: '~2/3', strength: 4 },
  { id: 'cappuccino', type: 'milk', name: { en: 'Cappuccino', cs: 'Cappuccino' }, sizeMl: 180, caffeineMg: 65, milkShare: '~2/3', strength: 3 },
  { id: 'latte', type: 'milk', name: { en: 'Caffè latte', cs: 'Caffè latte' }, sizeMl: 250, caffeineMg: 65, milkShare: '~4/5', strength: 2 },
];

export const MILKS: readonly Milk[] = ['cow', 'oat', 'soy'];
export const BEANS: readonly Bean[] = ['standard', 'premium', 'adaptogenic'];

export function drinkById(id: DrinkId): Drink {
  const drink = DRINKS.find((d) => d.id === id);
  if (!drink) throw new Error(`Unknown drink: ${id}`);
  return drink;
}

export function defaultConfig(id: DrinkId): DrinkConfig {
  return { drinkId: id, milk: drinkById(id).type === 'milk' ? 'cow' : null, bean: 'standard' };
}

/** Shown to new users as "Popular at VŠE" until they have their own usuals. */
export const POPULAR_AT_VSE: readonly DrinkConfig[] = [
  { drinkId: 'flatwhite', milk: 'cow', bean: 'standard' },
  { drinkId: 'cappuccino', milk: 'oat', bean: 'standard' },
  { drinkId: 'americano', milk: null, bean: 'standard' },
];

/** Reference drinks for the caffeine equivalents line on the Board (brief §4.8). */
export const CAFFEINE_EQUIVALENTS = {
  redBullCan: 80,
  blackTea: 47,
  espresso: 65,
} as const;
