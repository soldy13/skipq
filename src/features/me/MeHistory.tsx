import { useState } from 'react';
import { Link } from 'react-router-dom';
import m from './MeScreen.module.css';
import { StatusPill } from '../../components/StatusPill';
import { IconChevronDown } from '../../components/icons';
import { RAJSKA } from '../../data/machines';
import { DOT_SEP } from '../../domain/format';
import { orderStatus } from '../../domain/orders';
import { useStore } from '../../store/useStore';
import { useNow } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { configSummary, drinkName } from '../../i18n/drinkText';

const FIRST = 6;

/** Order history (brief §3 Me): newest first; expired orders say so (brief §4.4). Each row opens its status. */
export function MeHistory() {
  const tr = useT();
  const now = useNow();
  const orders = useStore((s) => s.orders);
  const [all, setAll] = useState(false);
  const sorted = [...orders].sort((a, b) => b.paidAt - a.paidAt);
  const shown = all ? sorted : sorted.slice(0, FIRST);

  return (
    <section className={m.section} aria-labelledby="history-title">
      <h2 id="history-title" className={m.heading}>
        {tr.t('me.history')}
      </h2>
      {sorted.length === 0 ? (
        <p className={m.note}>{tr.t('me.historyEmpty')}</p>
      ) : (
        <ul className={m.history}>
          {shown.map((o) => {
            const status = orderStatus(o, now, RAJSKA.brewMinutes);
            return (
              <li key={o.id}>
                <Link to={`/order/status/${o.id}`} className={m.historyRow}>
                  <span className={m.historyText}>
                    <span className={m.historyDrink}>
                      {drinkName(o.config.drinkId, tr)}
                      <span className={m.historySummary}>
                        {DOT_SEP}
                        {configSummary(o.config, tr)}
                      </span>
                    </span>
                    <span className={m.historyWhen}>
                      {tr.date(o.readyAt)}
                      {DOT_SEP}
                      <span className="sq-mono">{tr.time(o.readyAt)}</span>
                    </span>
                  </span>
                  <StatusPill status={status} label={tr.t(`status.${status}`)} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {!all && sorted.length > FIRST ? (
        <button type="button" className="sq-link" onClick={() => setAll(true)}>
          {tr.t('me.showAll', { n: sorted.length })}
          <IconChevronDown size={18} />
        </button>
      ) : null}
    </section>
  );
}
