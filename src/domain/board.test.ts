import { describe, expect, it } from 'vitest';
import { boardRows, caffeineEquivalents, monthProgress, yourRank } from './board';
import { buildSeed } from '../data/seed';
import { DEMO_START } from './clock';
import { addDays } from './time';
import type { World } from './types';

const now = DEMO_START;
const frederika = () => buildSeed('frederika', now);

describe('monthly board', () => {
  it('ranks by coffees with the user’s own row pinned at #12', () => {
    const board = boardRows(frederika(), 'coffees', now);
    expect(board.top).toHaveLength(10);
    expect(board.top[0]).toMatchObject({ rank: 1, nickname: 'espresso_eva', value: 61 });
    expect(board.top.some((r) => r.isYou)).toBe(false);
    expect(board.you).toMatchObject({ rank: 12, nickname: 'frederika_k', value: 31, isYou: true });
  });

  it('ranks by caffeine with the user’s derived milligrams', () => {
    const board = boardRows(frederika(), 'caffeine', now);
    const all = [...board.top, ...(board.you ? [board.you] : [])];
    expect(all.find((r) => r.isYou)?.value).toBeGreaterThan(2000);
    for (let i = 1; i < board.top.length; i += 1) expect(board.top[i - 1]!.value).toBeGreaterThanOrEqual(board.top[i]!.value);
  });

  it('shows the user inside the top 10 when they get there', () => {
    const w: World = { ...frederika() };
    const extra = Array.from({ length: 30 }, (_, i) => ({ ...w.orders[0]!, id: `x${i}`, pickedUpAt: now - i * 1000, paidAt: now - i * 1000 }));
    const board = boardRows({ ...w, orders: [...w.orders, ...extra] }, 'coffees', now);
    expect(board.top.find((r) => r.isYou)).toBeDefined();
    expect(board.you).toBeNull();
  });

  it('has no own row for someone without a nickname', () => {
    expect(boardRows(buildSeed('new', now), 'coffees', now).you).toBeNull();
  });

  it('starts over on the 1st', () => {
    const nov2 = new Date(2026, 10, 2, 10, 0).getTime();
    const board = boardRows(frederika(), 'coffees', nov2);
    expect(board.top[0]!.value).toBeLessThan(10);
    expect(board.you?.value ?? board.top.find((r) => r.isYou)?.value).toBe(0);
  });

  it('gives the user’s rank whether pinned or inside the top 10', () => {
    expect(yourRank(boardRows(frederika(), 'coffees', now))).toBe(12);
    const w = frederika();
    const extra = Array.from({ length: 40 }, (_, i) => ({ ...w.orders[0]!, id: `y${i}`, pickedUpAt: now - i * 1000, paidAt: now - i * 1000 }));
    expect(yourRank(boardRows({ ...w, orders: [...w.orders, ...extra] }, 'coffees', now))).toBe(1);
    expect(yourRank(boardRows(buildSeed('new', now), 'coffees', now))).toBeNull();
  });

  it('grows the others as the month goes on', () => {
    expect(monthProgress(now)).toBe(1);
    expect(monthProgress(addDays(now, 1))).toBeGreaterThan(1);
  });
});

describe('caffeine equivalents', () => {
  it('turns milligrams into cans, cups and shots', () => {
    expect(caffeineEquivalents(2000)).toEqual({ redBull: 25, blackTea: 43, espresso: 31 });
  });
});
