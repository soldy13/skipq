import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { initialState, useStore } from './useStore';
import { useActiveOrders, useBoxUsage, useDailyLimit, useNow, useSlotGrid, useUsuals } from './hooks';
import { useT } from '../i18n/useT';
import { DEMO_START } from '../domain/clock';
import { MINUTE } from '../domain/time';

beforeEach(() => {
  localStorage.clear();
  useStore.setState(initialState());
});

describe('store hooks', () => {
  it('reads the simulated clock and follows it', () => {
    const { result } = renderHook(() => useNow());
    expect(result.current).toBe(DEMO_START);
    act(() => useStore.getState().advance(MINUTE));
    expect(result.current).toBe(DEMO_START + MINUTE);
  });

  it('reports 12 of 30 boxes free with Frederika’s box among them', () => {
    const { result } = renderHook(() => useBoxUsage());
    expect(result.current).toMatchObject({ free: 12, total: 30 });
    expect([...result.current.mine]).toEqual([14]);
  });

  it('reports today’s allowance', () => {
    const { result } = renderHook(() => useDailyLimit());
    expect(result.current).toMatchObject({ used: 2, max: 3, reached: false });
  });

  it('lists the usuals and the active order', () => {
    const usuals = renderHook(() => useUsuals());
    expect(usuals.result.current.map((u) => u.count)).toEqual([23, 14, 9]);
    const active = renderHook(() => useActiveOrders());
    expect(active.result.current.map((o) => o.boxId)).toEqual([14]);
  });

  it('builds the slot grid from the live machine', () => {
    const { result } = renderHook(() => useSlotGrid());
    expect(result.current.now.available).toBe(true);
    expect(result.current.slots).toHaveLength(8);
  });

  it('keeps derived values stable between renders when nothing changed', () => {
    const { result, rerender } = renderHook(() => useUsuals());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('useT', () => {
  it('follows the language override', () => {
    const { result } = renderHook(() => useT());
    act(() => useStore.getState().setLanguage('cs'));
    expect(result.current.lang).toBe('cs');
    expect(result.current.t('tab.home')).toBe('Domů');
    expect(result.current.tp('slot.left', 2)).toBe('Zbývají 2');
    act(() => useStore.getState().setLanguage('en'));
    expect(result.current.t('tab.home')).toBe('Home');
    expect(result.current.time(DEMO_START)).toBe('09:58');
  });
});
