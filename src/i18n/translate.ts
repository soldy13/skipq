import { en } from './en';
import { cs } from './cs';
import type { Lang, LangPref } from '../domain/types';

export type MessageKey = keyof typeof en;
export type Dict = Record<MessageKey, string>;
export type Vars = Readonly<Record<string, string | number>>;

/** Plural families: keys that have a `.one` form, without the suffix. */
export type PluralKey = MessageKey extends infer K ? (K extends `${infer B}.one` ? B : never) : never;

const DICTS: Record<Lang, Dict> = { en, cs };
const LOCALES: Record<Lang, string> = { en: 'en-GB', cs: 'cs-CZ' };
const pluralRules = new Map<Lang, Intl.PluralRules>();

export function resolveLang(pref: LangPref, systemLang: string | undefined): Lang {
  if (pref !== 'auto') return pref;
  return systemLang?.toLowerCase().startsWith('cs') ? 'cs' : 'en';
}

function interpolate(template: string, vars: Vars | undefined): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function translate(lang: Lang, key: MessageKey, vars?: Vars): string {
  return interpolate(DICTS[lang][key] ?? en[key], vars);
}

export function translatePlural(lang: Lang, base: PluralKey, n: number, vars?: Vars): string {
  let rules = pluralRules.get(lang);
  if (!rules) {
    rules = new Intl.PluralRules(LOCALES[lang]);
    pluralRules.set(lang, rules);
  }
  const category = rules.select(n);
  const form = (category === 'one' || category === 'few' ? category : 'other') as 'one' | 'few' | 'other';
  return translate(lang, `${base}.${form}` as MessageKey, { n, ...vars });
}
