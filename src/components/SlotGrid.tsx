import { useId } from 'react';
import styles from './SlotGrid.module.css';
import { SlotChip } from './SlotChip';
import type { SlotGrid as Grid, SlotInfo } from '../domain/slots';
import { isSameDay } from '../domain/time';
import type { Translator } from '../i18n/useT';
import { RAJSKA } from '../data/machines';

export interface SlotGridProps {
  grid: Grid;
  /** Selected slot start, or null for Now. */
  selected: number | null;
  onSelect: (start: number | null) => void;
  now: number;
  tr: Translator;
  /** The surrounding sheet or screen already titles it. */
  hideTitle?: boolean;
}

function sublabel(slot: SlotInfo, tr: Translator): string | undefined {
  if (slot.state === 'full') return tr.t('slot.full');
  if (slot.state === 'few') return tr.tp('slot.left', slot.free);
  return undefined;
}

export function SlotGrid({ grid, selected, onSelect, now, tr, hideTitle = false }: SlotGridProps) {
  const titleId = useId();
  const first = grid.slots[0]?.start;
  const otherDay = first !== undefined && first !== null && !isSameDay(first, now);
  return (
    <section className={styles.wrap} aria-labelledby={hideTitle ? undefined : titleId} aria-label={hideTitle ? tr.t('slot.grid') : undefined}>
      {hideTitle && !otherDay ? null : (
        <div className={styles.head}>
          {hideTitle ? null : (
            <h2 id={titleId} className={styles.title}>
              {tr.t('slot.grid')}
            </h2>
          )}
          {otherDay && first ? <span className={styles.day}>{tr.date(first)}</span> : null}
        </div>
      )}
      <div className={styles.grid}>
        <SlotChip
          isNow
          label={tr.t('common.now')}
          sublabel={
            !grid.now.available
              ? tr.t('slot.closed')
              : grid.now.state === 'open'
                ? tr.t('slot.eta', { n: RAJSKA.brewMinutes })
                : sublabel(grid.now, tr)
          }
          state={grid.now.state}
          unavailable={!grid.now.available}
          selected={selected === null}
          onSelect={() => onSelect(null)}
        />
        {grid.slots.map((slot) => (
          <SlotChip
            key={slot.start}
            label={tr.time(slot.start as number)}
            sublabel={sublabel(slot, tr)}
            state={slot.state}
            selected={selected === slot.start}
            onSelect={() => onSelect(slot.start)}
          />
        ))}
      </div>
    </section>
  );
}
