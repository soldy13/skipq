/**
 * Monthly board for the demo month (brief §6.5). Synthetic. Caffeine = coffees × each user's typical mix.
 * The active persona's own row is replaced by numbers derived from their actual orders.
 */
export interface BoardEntry {
  nickname: string;
  coffees: number;
  /** Average caffeine per coffee for this user's usual mix. */
  avgMg: number;
}

export const LEADERBOARD: readonly BoardEntry[] = [
  { nickname: 'espresso_eva', coffees: 61, avgMg: 68 },
  { nickname: 'lecture_skipper', coffees: 57, avgMg: 90 },
  { nickname: 'rajska_raccoon', coffees: 52, avgMg: 85 },
  { nickname: 'deadline_dana', coffees: 48, avgMg: 105 },
  { nickname: 'crema_kral', coffees: 45, avgMg: 72 },
  { nickname: 'oat_of_office', coffees: 43, avgMg: 95 },
  { nickname: 'flatwhite_filip', coffees: 40, avgMg: 128 },
  { nickname: 'nova_budova_nina', coffees: 38, avgMg: 80 },
  { nickname: 'stat_stepan', coffees: 36, avgMg: 70 },
  { nickname: 'latte_lukas', coffees: 34, avgMg: 65 },
  { nickname: 'caffeine_kaja', coffees: 33, avgMg: 118 },
  { nickname: 'frederika_k', coffees: 31, avgMg: 92 },
  { nickname: 'ristretto_radek', coffees: 29, avgMg: 66 },
  { nickname: 'bus_from_beroun', coffees: 26, avgMg: 78 },
  { nickname: 'cems_coffee', coffees: 23, avgMg: 88 },
  { nickname: 'macro_marek', coffees: 20, avgMg: 74 },
  { nickname: 'cappu_carla', coffees: 17, avgMg: 65 },
  { nickname: 'double_shot_dom', coffees: 15, avgMg: 112 },
  { nickname: 'hayek_hana', coffees: 12, avgMg: 70 },
  { nickname: 'tomas_lungo', coffees: 10, avgMg: 75 },
];
