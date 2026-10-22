import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Screen.module.css';
import menu from './MenuScreen.module.css';
import { ScreenHeader } from '../ScreenHeader';
import { DrinkRow } from '../../components/DrinkRow';
import { DrinkInfoSheet } from '../order/DrinkInfoSheet';
import { DRINKS, defaultConfig } from '../../data/drinks';
import type { DrinkId } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n/useT';
import { drinkMeta } from '../../i18n/drinkText';
import { orderPath } from '../order/orderText';

export function MenuScreen() {
  const tr = useT();
  const navigate = useNavigate();
  const plan = useStore((s) => s.plan);
  const [info, setInfo] = useState<DrinkId | null>(null);

  return (
    <div className={styles.screen}>
      <ScreenHeader />
      <header className={styles.header}>
        <h1 className={styles.title}>{tr.t('menu.title')}</h1>
        <p className={menu.note}>{tr.t('menu.note')}</p>
      </header>
      <div className={menu.list}>
        {DRINKS.map((d) => (
          <DrinkRow
            key={d.id}
            name={d.name[tr.lang]}
            meta={drinkMeta(d.id, tr)}
            typeLabel={tr.t(`drink.type.${d.type}`)}
            strength={d.strength}
            strengthLabel={tr.t('compare.strengthOf', { n: d.strength })}
            infoLabel={tr.t('common.info', { drink: d.name[tr.lang] })}
            note={plan?.type === 'black' && d.type === 'milk' ? tr.t('payment.notCovered') : undefined}
            onOpen={() => navigate(orderPath(defaultConfig(d.id)))}
            onInfo={() => setInfo(d.id)}
          />
        ))}
      </div>
      <DrinkInfoSheet drinkId={info} onClose={() => setInfo(null)} />
    </div>
  );
}
