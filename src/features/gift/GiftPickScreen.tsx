import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Screen.module.css';
import menu from '../menu/MenuScreen.module.css';
import { ScreenHeader } from '../ScreenHeader';
import { DrinkRow } from '../../components/DrinkRow';
import { DrinkInfoSheet } from '../order/DrinkInfoSheet';
import { DRINKS } from '../../data/drinks';
import type { DrinkId } from '../../domain/types';
import { useT } from '../../i18n/useT';
import { drinkMeta } from '../../i18n/drinkText';

/** Gift → Send → drink: the same picker as ordering (brief §4.7). */
export function GiftPickScreen() {
  const tr = useT();
  const navigate = useNavigate();
  const [info, setInfo] = useState<DrinkId | null>(null);
  return (
    <div className={styles.screen}>
      <ScreenHeader fallback="/gift" />
      <h1 className={styles.title}>{tr.t('gift.pickTitle')}</h1>
      <div className={menu.list}>
        {DRINKS.map((d) => (
          <DrinkRow
            key={d.id}
            name={d.name[tr.lang]}
            meta={drinkMeta(d.id, tr)}
            typeLabel={tr.t(`drink.type.${d.type}`)}
            strength={d.strength}
            strengthLabel={tr.t('compare.strengthOf', { n: d.strength })}
            strengthWord={tr.t('compare.strength')}
            infoLabel={tr.t('common.info', { drink: d.name[tr.lang] })}
            onOpen={() => navigate(`/gift/send/${d.id}`)}
            onInfo={() => setInfo(d.id)}
          />
        ))}
      </div>
      <DrinkInfoSheet drinkId={info} onClose={() => setInfo(null)} />
    </div>
  );
}
