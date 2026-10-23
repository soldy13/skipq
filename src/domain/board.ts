import { LEADERBOARD } from '../data/leaderboard';
import { CAFFEINE_EQUIVALENTS } from '../data/drinks';
import { DEMO_START } from './clock';
import { caffeineThisMonth, coffeesThisMonth } from './stats';
import { addDays, isWeekday, startOfDay, startOfMonth } from './time';
import type { World } from './types';

export type BoardMetric = 'coffees' | 'caffeine';

export interface BoardRow {
  rank: number;
  nickname: string;
  value: number;
  isYou: boolean;
}

export interface Board {
  /** First ten, the user included if they're there. */
  top: BoardRow[];
  /** The user's own row, pinned below the top ten when they're outside it. */
  you: BoardRow | null;
}

const TOP = 10;

function weekdaysSoFar(t: number): number {
  let n = 0;
  for (let d = startOfMonth(t); d <= startOfDay(t); d = addDays(d, 1)) if (isWeekday(d)) n += 1;
  return n;
}

/**
 * How far into the month the others' seeded counts are. The leaderboard data describes the demo day
 * (Thu 22 Oct = 1); it grows through the month and starts again from zero on the 1st (brief §4.8).
 */
export function monthProgress(now: number): number {
  return weekdaysSoFar(now) / weekdaysSoFar(DEMO_START);
}

/** Monthly board by nickname only: everyone else from the seed, the user from their own picked-up orders. */
export function boardRows(world: World, metric: BoardMetric, now: number): Board {
  const progress = monthProgress(now);
  const me = world.profile.nickname;
  const others = LEADERBOARD.filter((e) => e.nickname !== me).map((e) => {
    const coffees = Math.round(e.coffees * progress);
    return { nickname: e.nickname, value: metric === 'coffees' ? coffees : coffees * e.avgMg, isYou: false };
  });
  const mine = me ? [{ nickname: me, value: metric === 'coffees' ? coffeesThisMonth(world.orders, now) : caffeineThisMonth(world.orders, now), isYou: true }] : [];
  const ranked = [...others, ...mine]
    .sort((a, b) => b.value - a.value || a.nickname.localeCompare(b.nickname))
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const you = ranked.find((r) => r.isYou) ?? null;
  return { top: ranked.slice(0, TOP), you: you && you.rank > TOP ? you : null };
}

/** The user's place on the board, inside the top ten or pinned below it; null without a nickname. */
export function yourRank(board: Board): number | null {
  return board.top.find((r) => r.isYou)?.rank ?? board.you?.rank ?? null;
}

/** "That's about 25 cans of Red Bull." — the board's rotating line (brief §4.8). */
export function caffeineEquivalents(mg: number): { redBull: number; blackTea: number; espresso: number } {
  return {
    redBull: Math.round(mg / CAFFEINE_EQUIVALENTS.redBullCan),
    blackTea: Math.round(mg / CAFFEINE_EQUIVALENTS.blackTea),
    espresso: Math.round(mg / CAFFEINE_EQUIVALENTS.espresso),
  };
}
