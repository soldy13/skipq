import styles from './BoxTag.module.css';

export interface BoxTagProps {
  n: number;
  /** Visible word before the number, e.g. "Box" / "Box". */
  word?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** The locker door plate: the box number is the product's promise, so it always looks like this. */
export function BoxTag({ n, word = 'Box', size = 'md' }: BoxTagProps) {
  return (
    <span className={`${styles.tag} ${styles[size]}`}>
      <span className={styles.word}>{word}</span>
      <span className={`${styles.n} sq-mono`}>{n}</span>
    </span>
  );
}
