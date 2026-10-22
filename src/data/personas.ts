import type { Addons, DrinkConfig, PaymentMethod, PersonaId, Plan } from '../domain/types';

export interface PersonaSpec {
  id: PersonaId;
  nickname: string | null;
  displayName: string | null;
  onboarded: boolean;
  plan: Plan | null;
  addons: Addons;
  packCredits: number;
  /** How their past orders were paid. */
  payment: PaymentMethod;
  /** Lifetime picked-up orders per configuration (brief §6.3). */
  history: readonly { config: DrinkConfig; count: number }[];
  /** Weekdays (day of month) with coffee, per month index → cups per day. */
  calendar: readonly { month: number; day: number; cups: number }[];
}

const NO_ADDONS: Addons = { premium: false, adaptogenic: false, altMilk: false };

const fwOat: DrinkConfig = { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' };
const capCow: DrinkConfig = { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' };
const americano: DrinkConfig = { drinkId: 'americano', milk: null, bean: 'standard' };
const lungo: DrinkConfig = { drinkId: 'lungo', milk: null, bean: 'standard' };
const espresso: DrinkConfig = { drinkId: 'espresso', milk: null, bean: 'standard' };

/** month is 0-based (8 = September, 9 = October). */
function days(month: number, list: readonly number[], cups: number) {
  return list.map((day) => ({ month, day, cups }));
}

export const PERSONAS: Readonly<Record<PersonaId, PersonaSpec>> = {
  frederika: {
    id: 'frederika',
    nickname: 'frederika_k',
    displayName: 'Frederika',
    onboarded: true,
    plan: { type: 'milk', perDay: 3 },
    addons: { premium: true, adaptogenic: false, altMilk: true },
    packCredits: 0,
    payment: 'plan',
    // 22 picked up + today's active flat white = 23.
    history: [
      { config: fwOat, count: 22 },
      { config: capCow, count: 14 },
      { config: americano, count: 9 },
    ],
    // 14 in late September; 31 in October incl. one this morning. No coffee on Wed 14 Oct → streak 6.
    calendar: [
      ...days(8, [21, 22, 23, 24, 28, 29], 2),
      ...days(8, [25, 30], 1),
      ...days(9, [1, 2, 5, 6, 8, 9, 12, 13, 15, 16, 19, 21], 2),
      ...days(9, [7, 20], 3),
      ...days(9, [22], 1),
    ],
  },
  tomas: {
    id: 'tomas',
    nickname: 'tomas_lungo',
    displayName: 'Tomáš',
    onboarded: true,
    plan: null,
    addons: NO_ADDONS,
    packCredits: 7,
    payment: 'pack',
    history: [
      { config: lungo, count: 12 },
      { config: espresso, count: 5 },
    ],
    calendar: [
      ...days(8, [22, 23, 24, 25, 28, 29, 30], 1),
      ...days(9, [2, 6, 8, 9, 13, 15, 16, 19, 20, 21], 1),
    ],
  },
  new: {
    id: 'new',
    nickname: null,
    displayName: null,
    onboarded: false,
    plan: null,
    addons: NO_ADDONS,
    packCredits: 0,
    payment: 'single',
    history: [],
    calendar: [],
  },
};

export const PERSONA_IDS: readonly PersonaId[] = ['frederika', 'tomas', 'new'];
