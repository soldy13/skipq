import styles from './StrengthDots.module.css';

/**
 * Strength 1–5 as five dots; `label` carries the value for screen readers. `word` prints "Strength" beside
 * them, so the dots never read as a caffeine rating next to a mg figure.
 */
export function StrengthDots({ value, label, word, max = 5 }: { value: number; label: string; word?: string; max?: number }) {
  const dots = (
    <span className={styles.dots} role="img" aria-label={label}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? styles.on : styles.off} />
      ))}
    </span>
  );
  if (!word) return dots;
  return (
    <span className={styles.labelled}>
      <span aria-hidden="true">{word}</span>
      {dots}
    </span>
  );
}
