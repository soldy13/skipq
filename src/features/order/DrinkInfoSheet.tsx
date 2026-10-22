import styles from './sheets.module.css';
import { BottomSheet } from '../../components/BottomSheet';
import { DrinkCompare } from '../../components/DrinkCompare';
import { drinkById } from '../../data/drinks';
import type { DrinkId } from '../../domain/types';
import { useT } from '../../i18n/useT';
import { drinkMeta, drinkName } from '../../i18n/drinkText';

/** The "i" sheet (brief §4.9): this drink's facts and how it compares with the rest of the menu. */
export function DrinkInfoSheet({ drinkId, onClose }: { drinkId: DrinkId | null; onClose: () => void }) {
  const tr = useT();
  const id = drinkId ?? 'espresso';
  const drink = drinkById(id);
  return (
    <BottomSheet open={drinkId !== null} onClose={onClose} title={drinkName(id, tr)} subtitle={tr.t('compare.title')} closeLabel={tr.t('common.close')}>
      <p className={styles.facts}>
        {drinkMeta(id, tr)} · {tr.t(`drink.type.${drink.type}`)} · {tr.t('compare.strengthOf', { n: drink.strength })}
      </p>
      <DrinkCompare current={id} tr={tr} />
    </BottomSheet>
  );
}
