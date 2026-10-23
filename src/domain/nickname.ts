/** Brief F16: a nickname is 3–16 characters of a–z, 0–9 and _. It is the only name the board ever shows. */
export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 16;

const ALLOWED = /^[a-z0-9_]$/;

export type NicknameError = { kind: 'short' } | { kind: 'long' } | { kind: 'char'; char: string } | { kind: 'taken' };

export type NicknameCheck = { ok: true; nickname: string } | { ok: false; error: NicknameError; suggestion: string | null };

/** What the field keeps as you type: no surrounding spaces, lowercase (uppercase is never allowed anyway). */
export function normalizeNickname(raw: string): string {
  return raw.trim().toLowerCase();
}

/** "Šárka K." → "sarka_k": accents dropped, spaces and dashes become underscores, the rest removed, cut to 16. */
function cleaned(raw: string): string {
  return normalizeNickname(raw)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .slice(0, NICKNAME_MAX);
}

/** A valid nickname close to what was typed and not on the board, or null when too little is left. */
export function suggestNickname(raw: string, taken: readonly string[]): string | null {
  const base = cleaned(raw);
  if (base.length < NICKNAME_MIN) return null;
  if (!taken.includes(base)) return base;
  for (let n = 2; n < 100; n += 1) {
    const suffix = `_${n}`;
    const candidate = base.slice(0, NICKNAME_MAX - suffix.length) + suffix;
    if (!taken.includes(candidate)) return candidate;
  }
  return null;
}

/** Characters first (the most specific problem), then length, then whether someone on the board has it. */
export function validateNickname(raw: string, taken: readonly string[]): NicknameCheck {
  const nickname = normalizeNickname(raw);
  const bad = [...nickname].find((c) => !ALLOWED.test(c));
  if (bad !== undefined) return { ok: false, error: { kind: 'char', char: bad }, suggestion: suggestNickname(raw, taken) };
  if (nickname.length < NICKNAME_MIN) return { ok: false, error: { kind: 'short' }, suggestion: null };
  if (nickname.length > NICKNAME_MAX) return { ok: false, error: { kind: 'long' }, suggestion: suggestNickname(raw, taken) };
  if (taken.includes(nickname)) return { ok: false, error: { kind: 'taken' }, suggestion: suggestNickname(raw, taken) };
  return { ok: true, nickname };
}
