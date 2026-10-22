import styles from './BoardRow.module.css';
import { IconChevronRight } from './icons';
import { Amount } from './Amount';

export interface BoardRowProps {
  rank: number;
  nickname: string;
  value: number;
  /** "mg" on the caffeine board. */
  unit?: string;
  isYou?: boolean;
  youLabel?: string;
  /** Own row opens personal stats. */
  onClick?: () => void;
}

export function BoardRow({ rank, nickname, value, unit, isYou, youLabel, onClick }: BoardRowProps) {
  const content = (
    <>
      <span className={`${styles.rank} sq-mono`}>{rank}</span>
      <span className={styles.name}>
        {nickname}
        {isYou && youLabel ? <span className={styles.you}>{youLabel}</span> : null}
      </span>
      <span className={styles.value}>
        <Amount value={value} unit={unit} />
      </span>
      {onClick ? <IconChevronRight size={18} className={styles.chev} /> : null}
    </>
  );
  const cls = [styles.row, isYou && styles.mine, rank <= 3 && styles.podium, onClick && styles.clickable].filter(Boolean).join(' ');
  return onClick ? (
    <button type="button" className={cls} onClick={onClick} aria-current={isYou ? 'true' : undefined}>
      {content}
    </button>
  ) : (
    <div className={cls} aria-current={isYou ? 'true' : undefined}>
      {content}
    </div>
  );
}
