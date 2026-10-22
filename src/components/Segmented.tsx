import { useRef, type KeyboardEvent } from 'react';
import styles from './Segmented.module.css';

export interface SegmentOption<V extends string> {
  value: V;
  label: string;
  /** Second line, e.g. "27 credits left". */
  sublabel?: string;
  disabled?: boolean;
  /** Why it's disabled — shown under the control, in neutral words. */
  reason?: string;
}

export interface SegmentedProps<V extends string> {
  label: string;
  options: readonly SegmentOption<V>[];
  value: V;
  onChange: (value: V) => void;
  tone?: 'light' | 'dark';
}

/** Radio group drawn as a segmented control. Arrow keys move between enabled options. */
export function Segmented<V extends string>({ label, options, value, onChange, tone = 'light' }: SegmentedProps<V>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const reasons = options.filter((o) => o.disabled && o.reason);
  const checkedIndex = options.findIndex((o) => o.value === value && !o.disabled);
  // Keep exactly one tab stop even when the checked option is disabled or missing.
  const tabStop = checkedIndex >= 0 ? checkedIndex : (enabled[0] ?? -1);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!dir || enabled.length === 0) return;
    e.preventDefault();
    const current = enabled.indexOf(checkedIndex);
    const next = (current < 0 ? enabled[dir > 0 ? 0 : enabled.length - 1] : enabled[(current + dir + enabled.length) % enabled.length]) as number;
    const option = options[next];
    if (option) {
      onChange(option.value);
      refs.current[next]?.focus();
    }
  }

  return (
    <div className={styles.wrap}>
      <div role="radiogroup" aria-label={label} className={`${styles.track} ${styles[tone]}`} onKeyDown={onKeyDown}>
        {options.map((o, i) => {
          const checked = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={i === tabStop ? 0 : -1}
              disabled={o.disabled}
              className={[styles.option, checked && styles.checked].filter(Boolean).join(' ')}
              onClick={() => onChange(o.value)}
            >
              <span className={styles.label}>{o.label}</span>
              {o.sublabel ? <span className={styles.sub}>{o.sublabel}</span> : null}
            </button>
          );
        })}
      </div>
      {reasons.length > 0 ? (
        <ul className={styles.reasons}>
          {reasons.map((o) => (
            <li key={o.value}>
              <strong>{o.label}</strong> · {o.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
