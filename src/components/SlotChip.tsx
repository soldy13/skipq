import styles from './SlotChip.module.css';
import type { SlotState } from '../domain/slots';

export interface SlotChipProps {
  /** "10:30" or "Now". */
  label: string;
  /** "3 left", "Full", "ready ≈ 2 min"… */
  sublabel?: string;
  state: SlotState;
  selected?: boolean;
  /** Now is styled as a word, not a time. */
  isNow?: boolean;
  /** Closed or otherwise not offered (separate from Full). */
  unavailable?: boolean;
  onSelect?: () => void;
}

export function SlotChip({ label, sublabel, state, selected = false, isNow, unavailable, onSelect }: SlotChipProps) {
  const disabled = state === 'full' || unavailable;
  const cls = [styles.slot, styles[state], selected && !disabled && styles.selected, isNow && styles.now].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={selected && !disabled} disabled={disabled} onClick={onSelect}>
      <span className={isNow ? styles.word : `${styles.time} sq-mono`}>{label}</span>
      {sublabel ? <span className={styles.sub}>{sublabel}</span> : null}
    </button>
  );
}
