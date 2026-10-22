import styles from './DrinkRow.module.css';
import { IconButton } from './Button';
import { IconChevronRight, IconInfo } from './icons';
import { StrengthDots } from './StrengthDots';

export interface DrinkRowProps {
  name: string;
  /** "160 ml · 130 mg caffeine" */
  meta: string;
  /** "With milk" / "Black" */
  typeLabel: string;
  strength: number;
  strengthLabel: string;
  /** Visible word before the dots: "Strength". */
  strengthWord: string;
  infoLabel: string;
  onOpen: () => void;
  onInfo: () => void;
  /** Not covered by the user's plan, etc. Shown as a quiet note, the row stays tappable. */
  note?: string;
}

export function DrinkRow({ name, meta, typeLabel, strength, strengthLabel, strengthWord, infoLabel, onOpen, onInfo, note }: DrinkRowProps) {
  return (
    <div className={styles.row}>
      <button type="button" className={styles.main} onClick={onOpen}>
        <span className={styles.top}>
          <span className={styles.name}>{name}</span>
          <span className={styles.type}>{typeLabel}</span>
        </span>
        <span className={styles.meta}>
          <span>{meta}</span>
          <StrengthDots value={strength} label={strengthLabel} word={strengthWord} />
        </span>
        {note ? <span className={styles.note}>{note}</span> : null}
        <IconChevronRight size={18} className={styles.chev} />
      </button>
      <IconButton label={infoLabel} icon={<IconInfo />} onClick={onInfo} className={styles.info} />
    </div>
  );
}
