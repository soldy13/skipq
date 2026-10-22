import styles from './UsualCard.module.css';
import { Button } from './Button';
import { IconChevronRight } from './icons';

export interface UsualCardProps {
  name: string;
  /** "Oat · Premium" */
  summary: string;
  /** "Ordered 23×" or "Popular at VŠE". */
  note?: string;
  /** "Order · Now" */
  orderLabel: string;
  onOrder: () => void;
  /** Card body: opens the full order screen pre-filled. */
  onOpen: () => void;
  ordering?: boolean;
  orderingLabel?: string;
  disabled?: boolean;
}

/** One-tap reorder. The body and the button are siblings, never nested. */
export function UsualCard({ name, summary, note, orderLabel, onOrder, onOpen, ordering, orderingLabel, disabled }: UsualCardProps) {
  return (
    <article className={styles.card}>
      <button type="button" className={styles.body} onClick={onOpen}>
        <span className={styles.name}>{name}</span>
        <span className={styles.summary}>{summary}</span>
        {note ? <span className={styles.note}>{note}</span> : null}
        <IconChevronRight size={18} className={styles.chev} />
      </button>
      <Button variant="secondary" compact className={styles.order} onClick={onOrder} loading={ordering} loadingLabel={orderingLabel} disabled={disabled}>
        {orderLabel}
      </Button>
    </article>
  );
}
