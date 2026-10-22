import { describe, expect, it } from 'vitest';
import { readyToNotify } from './notices';
import { buildSeed } from '../data/seed';
import { DEMO_START } from './clock';
import { atClock } from './time';

const at = (hhmm: string) => atClock(DEMO_START, hhmm);

describe('ready notifications', () => {
  const orders = buildSeed('frederika', DEMO_START).orders;

  it('notifies nothing before the coffee is ready', () => {
    expect(readyToNotify(orders, [], at('10:14'))).toEqual([]);
  });

  it('notifies once the coffee is ready', () => {
    expect(readyToNotify(orders, [], at('10:15'))).toEqual(['o_frederika_active']);
  });

  it('never notifies twice', () => {
    expect(readyToNotify(orders, ['o_frederika_active'], at('10:20'))).toEqual([]);
  });

  it('stays quiet when the clock jumps past the hold — that order expired', () => {
    expect(readyToNotify(orders, [], at('11:00'))).toEqual([]);
  });
});
