import styles from './StrengthDots.module.css';

/** Strength 1–5 as five dots; the label carries the value for screen readers. */
export function StrengthDots({ value, label, max = 5 }: { value: number; label: string; max?: number }) {
  return (
    <span className={styles.dots} role="img" aria-label={label}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? styles.on : styles.off} />
      ))}
    </span>
  );
}
