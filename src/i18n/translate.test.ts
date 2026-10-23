import { describe, expect, it } from 'vitest';
import { en } from './en';
import { cs } from './cs';
import { resolveLang, translate, translatePlural } from './translate';

describe('dictionaries', () => {
  it('has a Czech string for every English key and nothing extra', () => {
    expect(Object.keys(cs).sort()).toEqual(Object.keys(en).sort());
  });

  it('keeps every {placeholder} in both languages', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(vars(cs[key]), key).toEqual(vars(en[key]));
    }
  });

  it('carries the starter strings from the brief', () => {
    expect(en['home.greeting.morning']).toBe('Morning, {name}.');
    expect(cs['home.usuals']).toBe('Tvoje klasika');
    // Same words as the brief; the dash is glued to the word before it with a no-break space.
    expect(cs['limit.reached'].replace(/\u00A0/g, ' ')).toBe('Dnešní tři máš za sebou. Nové od půlnoci — nebo si kup jednu kávu.');
    expect(cs['status.expired']).toBe('Propadlo');
  });
});

describe('translate', () => {
  it('interpolates variables', () => {
    expect(translate('en', 'pickup.title', { n: 14 })).toBe('Box 14 is yours.');
    expect(translate('cs', 'order.cta', { drink: 'Flat white', time: '10:30' })).toBe('Objednat Flat white ·\u00A010:30');
  });

  it('leaves unknown placeholders visible rather than blank', () => {
    expect(translate('en', 'pickup.title', {})).toBe('Box {n} is yours.');
  });

  it('picks Czech plural forms', () => {
    expect(translatePlural('cs', 'slot.left', 1)).toBe('Zbývá 1');
    expect(translatePlural('cs', 'slot.left', 3)).toBe('Zbývají 3');
    expect(translatePlural('cs', 'slot.left', 5)).toBe('Zbývá 5');
    expect(translatePlural('en', 'slot.left', 1)).toBe('1 left');
  });
});

describe('language resolution', () => {
  it('follows the system language on Auto', () => {
    expect(resolveLang('auto', 'cs-CZ')).toBe('cs');
    expect(resolveLang('auto', 'cs')).toBe('cs');
    expect(resolveLang('auto', 'sk-SK')).toBe('en');
    expect(resolveLang('auto', undefined)).toBe('en');
  });

  it('respects an explicit override', () => {
    expect(resolveLang('en', 'cs-CZ')).toBe('en');
    expect(resolveLang('cs', 'en-US')).toBe('cs');
  });
});
