import { useEffect, useRef, useState, type ComponentType } from 'react';
import styles from './Styleguide.module.css';
import { Section } from './Specimen';
import * as Icons from '../../components/icons';
import type { IconProps } from '../../components/icons';

const COLORS: readonly { name: string; role: string }[] = [
  { name: '--sq-coffee', role: 'Primary actions, active tab, links' },
  { name: '--sq-coffee-100', role: 'Subtle fills, segmented ground, focus halo' },
  { name: '--sq-coffee-200', role: 'Boxes in use' },
  { name: '--sq-coffee-400', role: 'Meters' },
  { name: '--sq-coffee-700', role: 'Pressed / hover' },
  { name: '--sq-coffee-900', role: 'Text on Vanilla' },
  { name: '--sq-vanilla', role: 'Selected, yours, gift moments' },
  { name: '--sq-foam', role: 'App ground' },
  { name: '--sq-espresso', role: 'Text, icons, unlock button' },
  { name: '--sq-surface', role: 'Cards, sheets, inputs' },
  { name: '--sq-line', role: 'Dividers, borders' },
  { name: '--sq-disabled-bg', role: 'Full slots, disabled fields' },
  { name: '--sq-gray', role: 'Disabled fills — never text' },
  { name: '--sq-stone', role: 'Secondary text (not on Vanilla)' },
  { name: '--sq-ready', role: 'Ready' },
  { name: '--sq-brewing', role: 'Brewing, few left' },
  { name: '--sq-expired', role: 'Expired, errors' },
];

function Swatch({ name, role }: { name: string; role: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current) setValue(getComputedStyle(ref.current).getPropertyValue(name).trim());
  }, [name]);
  return (
    <li className={styles.swatch}>
      <span ref={ref} className={styles.chipColor} style={{ background: `var(${name})` }} />
      <span className={styles.swatchText}>
        <code>{name}</code>
        <span className="sq-mono">{value}</span>
        <span>{role}</span>
      </span>
    </li>
  );
}

const TYPE: readonly { token: string; sample: string; note: string }[] = [
  { token: '--sq-wordmark', sample: 'SkipQ', note: 'Instrument Serif italic 32' },
  { token: '--sq-display', sample: 'Morning, Frederika.', note: 'Instrument Serif 40/44 — greetings' },
  { token: '--sq-title', sample: 'Box 14 is yours.', note: 'Instrument Serif 28/32 — titles, the ready moment' },
  { token: '--sq-heading', sample: 'Your usuals', note: 'DM Sans 600 20/26' },
  { token: '--sq-body', sample: 'Pick a slot and we brew it just in time.', note: 'DM Sans 400 16/24' },
  { token: '--sq-button', sample: 'Order flat white · 10:30', note: 'DM Sans 600 16/24' },
  { token: '--sq-body-sm', sample: 'Oat · Premium', note: 'DM Sans 400 14/20' },
  { token: '--sq-caption', sample: 'ready ≈ 2 min', note: 'DM Sans 500 12/16' },
  { token: '--sq-overline', sample: 'BOXES AT RAJSKÁ', note: 'DM Sans 600 12/16, +0.08em, uppercase' },
  { token: '--sq-numeric', sample: '10:45 · SKQ-7M4T · 1 199 Kč', note: 'DM Mono 500 28/32 — times, codes, counters' },
];

export function Foundations() {
  const icons = Object.entries(Icons).filter(([key]) => key.startsWith('Icon')) as [string, ComponentType<IconProps>][];
  return (
    <>
      <Section id="color" name="Colour" note="Tokens from tokens.css. Components reference these variables only — no hex values.">
        <ul className={styles.swatches}>
          {COLORS.map((c) => (
            <Swatch key={c.name} {...c} />
          ))}
        </ul>
      </Section>
      <Section id="type" name="Type" note="Serif for greetings, titles and the ready moment (never below 24 px). Sans for UI. Mono for times, codes, counters and prices in tables.">
        <ul className={styles.typeList}>
          {TYPE.map((t) => (
            <li key={t.token} className={styles.typeRow}>
              <span style={{ font: `var(${t.token})`, letterSpacing: t.token === '--sq-overline' ? '0.08em' : undefined }}>{t.sample}</span>
              <code>
                {t.token} · {t.note}
              </code>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="icons" name="Icons" note="24 px grid, 1.75 stroke, round caps and joins. Decorative unless given a title.">
        <ul className={styles.iconGrid}>
          {icons.map(([key, Icon]) => (
            <li key={key}>
              <Icon />
              <code>{key.replace('Icon', '')}</code>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
