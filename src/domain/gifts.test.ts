import { describe, expect, it } from 'vitest';
import { CODE_ALPHABET, generateGiftCode, giftStatus, isCompleteCode, normalizeCodeInput } from './gifts';
import { mulberry32 } from './random';
import type { GiftCode } from './types';

const DAY = 86_400_000;

describe('gift codes', () => {
  it('generates SKQ-XXXX from the unambiguous alphabet', () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 200; i += 1) {
      const code = generateGiftCode(rand, new Set());
      expect(code).toMatch(/^SKQ-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
    }
    expect(CODE_ALPHABET).not.toMatch(/[IL0O1]/);
  });

  it('never repeats a code that is already taken', () => {
    const taken = new Set<string>();
    const rand = mulberry32(1);
    for (let i = 0; i < 500; i += 1) taken.add(generateGiftCode(rand, taken));
    expect(taken.size).toBe(500);
  });

  it('normalises typed input: uppercase, prefix, dash', () => {
    expect(normalizeCodeInput('7m4t')).toBe('SKQ-7M4T');
    expect(normalizeCodeInput('skq7m')).toBe('SKQ-7M');
    expect(normalizeCodeInput('SKQ-7M4T-extra')).toBe('SKQ-7M4T');
    expect(normalizeCodeInput(' skq - 2kqx ')).toBe('SKQ-2KQX');
    expect(normalizeCodeInput('')).toBe('');
  });

  it('lets the prefix be typed one letter at a time', () => {
    const typed = ['S', 'SK', 'SKQ', 'SKQ-', 'SKQ-7', 'SKQ-7M', 'SKQ-7M4', 'SKQ-7M4T'];
    expect(typed.map(normalizeCodeInput)).toEqual(typed);
  });

  it('lets the dash and prefix be deleted again', () => {
    expect(normalizeCodeInput('SKQ')).toBe('SKQ');
    expect(normalizeCodeInput('SK')).toBe('SK');
  });

  it('finds the code inside a pasted message', () => {
    expect(normalizeCodeInput('Coffee on me! SKQ-7M4T')).toBe('SKQ-7M4T');
    expect(normalizeCodeInput('kafe ode mě: skq 2kqx :)')).toBe('SKQ-2KQX');
  });

  it('drops characters that can never appear in a code', () => {
    expect(normalizeCodeInput('7m0t')).toBe('SKQ-7MT');
  });

  it('knows a complete code', () => {
    expect(isCompleteCode('SKQ-7M4T')).toBe(true);
    expect(isCompleteCode('SKQ-7M4')).toBe(false);
  });
});

describe('gift status', () => {
  const base: GiftCode = {
    code: 'SKQ-4H7P',
    config: { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' },
    fromNickname: 'frederika_k',
    createdAt: 0,
    expiresAt: 5 * DAY,
    payment: 'plan',
    redeemedBy: null,
    redeemedAt: null,
    returnedAt: null,
  };

  it('is pending while valid and unredeemed', () => {
    expect(giftStatus(base, DAY)).toBe('pending');
  });

  it('is redeemed once someone used it', () => {
    expect(giftStatus({ ...base, redeemedBy: 'x', redeemedAt: DAY }, 6 * DAY)).toBe('redeemed');
  });

  it('is returned after five days unredeemed', () => {
    expect(giftStatus(base, 5 * DAY)).toBe('returned');
  });
});
