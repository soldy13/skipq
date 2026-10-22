import styles from './DrinkCompare.module.css';
import { DRINKS } from '../data/drinks';
import type { DrinkId } from '../domain/types';
import type { Translator } from '../i18n/useT';
import { StrengthDots } from './StrengthDots';

export interface DrinkCompareProps {
  /** Highlighted row. */
  current?: DrinkId;
  tr: Translator;
}

/** Size, caffeine, milk share and strength for every drink (brief §4.9). */
export function DrinkCompare({ current, tr }: DrinkCompareProps) {
  return (
    <figure className={styles.wrap}>
      <table className={styles.table}>
        <caption className="sq-sr-only">{tr.t('compare.title')}</caption>
        <thead>
          <tr>
            <th scope="col">{tr.t('compare.drink')}</th>
            <th scope="col" className={styles.num}>
              {tr.t('compare.size')}
            </th>
            <th scope="col" className={styles.num}>
              {tr.t('compare.caffeine')}
            </th>
            <th scope="col" className={styles.num}>
              {tr.t('compare.milk')}
            </th>
            <th scope="col">{tr.t('compare.strength')}</th>
          </tr>
        </thead>
        <tbody>
          {DRINKS.map((d) => (
            <tr key={d.id} className={d.id === current ? styles.current : undefined} aria-current={d.id === current ? 'true' : undefined}>
              <th scope="row">{d.name[tr.lang]}</th>
              <td className={`${styles.num} sq-mono`}>{d.sizeMl} ml</td>
              <td className={`${styles.num} sq-mono`}>{d.caffeineMg} mg</td>
              <td className={`${styles.num} sq-mono`}>{d.milkShare}</td>
              <td>
                <StrengthDots value={d.strength} label={tr.t('compare.strengthOf', { n: d.strength })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className={styles.foot}>{tr.t('compare.footnote')}</figcaption>
    </figure>
  );
}
