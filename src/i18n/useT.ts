import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatDate, formatMg, formatPrice, formatTime } from '../domain/format';
import type { Lang } from '../domain/types';
import { resolveLang, translate, translatePlural, type MessageKey, type PluralKey, type Vars } from './translate';

export interface Translator {
  lang: Lang;
  t: (key: MessageKey, vars?: Vars) => string;
  tp: (key: PluralKey, n: number, vars?: Vars) => string;
  time: (t: number) => string;
  date: (t: number) => string;
  price: (kc: number) => string;
  mg: (mg: number) => string;
}

function systemLanguage(): string | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator.language;
}

export function makeTranslator(lang: Lang): Translator {
  return {
    lang,
    t: (key, vars) => translate(lang, key, vars),
    tp: (key, n, vars) => translatePlural(lang, key, n, vars),
    time: (t) => formatTime(t, lang),
    date: (t) => formatDate(t, lang),
    price: formatPrice,
    mg: formatMg,
  };
}

/** Strings and formatters in the active language: profile override, else the system language. */
export function useT(): Translator {
  const pref = useStore((s) => s.profile.language);
  const lang = resolveLang(pref, systemLanguage());
  return useMemo(() => makeTranslator(lang), [lang]);
}
