import { drinkById } from '../data/drinks';
import type { DrinkConfig, DrinkId } from '../domain/types';
import type { Translator } from './useT';

export function drinkName(id: DrinkId, tr: Translator): string {
  return drinkById(id).name[tr.lang];
}

/** Lower-cased name for mid-sentence use in English ("Your flat white is ready"). */
export function drinkNameInline(id: DrinkId, tr: Translator): string {
  return inlineLabel(drinkName(id, tr), tr);
}

/** A label used mid-sentence: lower-case first letter ("up to 3 a day", "až 3 denně"). */
export function inlineLabel(text: string, tr: Translator): string {
  return tr.lang === 'en' || tr.lang === 'cs' ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/** "Oat · Premium" — only what differs from a plain order, so the line stays short. */
export function configSummary(config: DrinkConfig, tr: Translator): string {
  const parts: string[] = [];
  if (config.milk) parts.push(tr.t(`milk.${config.milk}`));
  if (config.bean !== 'standard') parts.push(tr.t(`bean.${config.bean}`));
  if (parts.length === 0) parts.push(tr.t(`drink.type.${drinkById(config.drinkId).type}`));
  return parts.join(' · ');
}

export function drinkMeta(id: DrinkId, tr: Translator): string {
  const d = drinkById(id);
  return tr.t('drink.meta', { size: d.sizeMl, caffeine: tr.mg(d.caffeineMg) });
}
