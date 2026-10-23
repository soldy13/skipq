import { describe, expect, it } from 'vitest';
import { normalizeNickname, suggestNickname, validateNickname } from './nickname';

const taken = ['espresso_eva', 'crema_kral'];

describe('nickname rules (brief F16: 3–16 chars, a–z 0–9 _)', () => {
  it('accepts lowercase letters, digits and underscores', () => {
    expect(validateNickname('crema_new', taken)).toEqual({ ok: true, nickname: 'crema_new' });
    expect(validateNickname('abc', taken).ok).toBe(true);
    expect(validateNickname('a_234567890123456'.slice(0, 16), taken).ok).toBe(true);
  });

  it('lowercases and trims before checking', () => {
    expect(normalizeNickname('  Crema_New ')).toBe('crema_new');
    expect(validateNickname('Crema_New', taken)).toEqual({ ok: true, nickname: 'crema_new' });
  });

  it('is too short below 3 characters', () => {
    expect(validateNickname('ab', taken)).toMatchObject({ ok: false, error: { kind: 'short' } });
    expect(validateNickname('', taken)).toMatchObject({ ok: false, error: { kind: 'short' } });
  });

  it('is too long above 16 characters, and suggests a cut', () => {
    const r = validateNickname('a_very_long_nickname', taken);
    expect(r).toMatchObject({ ok: false, error: { kind: 'long' }, suggestion: 'a_very_long_nick' });
  });

  it('names the first character it can’t use, and suggests a clean version', () => {
    expect(validateNickname('šárka', taken)).toMatchObject({ ok: false, error: { kind: 'char', char: 'š' }, suggestion: 'sarka' });
    expect(validateNickname('frederika k', taken)).toMatchObject({ ok: false, error: { kind: 'char', char: ' ' }, suggestion: 'frederika_k' });
    expect(validateNickname('tom-lungo', taken)).toMatchObject({ ok: false, error: { kind: 'char', char: '-' }, suggestion: 'tom_lungo' });
  });

  it('refuses a nickname already on the board, and offers a free variant', () => {
    expect(validateNickname('espresso_eva', taken)).toMatchObject({ ok: false, error: { kind: 'taken' }, suggestion: 'espresso_eva_2' });
  });

  it('suggests nothing when nothing usable is left', () => {
    expect(suggestNickname('!!', taken)).toBeNull();
    expect(validateNickname('☕☕', taken)).toMatchObject({ ok: false, error: { kind: 'char', char: '☕' }, suggestion: null });
  });

  it('keeps suggestions inside 16 characters and off the taken list', () => {
    const long = 'abcdefghijklmnop';
    const s = suggestNickname(long, [long]);
    expect(s).not.toBeNull();
    expect(s!.length).toBeLessThanOrEqual(16);
    expect(s).not.toBe(long);
  });
});
