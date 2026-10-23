import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Screen.module.css';
import b from './BoardScreen.module.css';
import { RichText } from '../../components/RichText';
import { BoardRow } from '../../components/BoardRow';
import { Segmented } from '../../components/Segmented';
import { IconChevronRight } from '../../components/icons';
import { boardRows, caffeineEquivalents, type BoardMetric } from '../../domain/board';
import { caffeineThisMonth } from '../../domain/stats';
import { formatMonth, groupThousands } from '../../domain/format';
import { useStore } from '../../store/useStore';
import { useNow, useWorld } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import type { PluralKey } from '../../i18n/translate';

/** Real seconds between equivalents lines. */
const ROTATE_MS = 6000;
const EQUIVALENTS: readonly { key: PluralKey; pick: (e: ReturnType<typeof caffeineEquivalents>) => number }[] = [
  { key: 'stat.eqRedBull', pick: (e) => e.redBull },
  { key: 'stat.eqTea', pick: (e) => e.blackTea },
  { key: 'stat.eqEspresso', pick: (e) => e.espresso },
];

/** Monthly board (brief §4.8): nicknames only, Coffees or Caffeine, top ten plus your own row. */
export function BoardScreen() {
  const tr = useT();
  const navigate = useNavigate();
  const now = useNow();
  const world = useWorld();
  const orders = useStore((s) => s.orders);
  const [metric, setMetric] = useState<BoardMetric>('coffees');
  const [line, setLine] = useState(0);
  const board = useMemo(() => boardRows(world, metric, now), [world, metric, now]);
  const mg = useMemo(() => caffeineThisMonth(orders, now), [orders, now]);

  useEffect(() => {
    const id = window.setInterval(() => setLine((n) => (n + 1) % EQUIVALENTS.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const unit = metric === 'caffeine' ? 'mg' : undefined;
  const openStats = () => navigate('/me');
  const eq = EQUIVALENTS[line] ?? EQUIVALENTS[0]!;

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{tr.t('screen.board')}</h1>
        <p className={b.month}>{formatMonth(now, tr.lang)}</p>
      </header>
      <Segmented<BoardMetric>
        label={tr.t('board.metric')}
        value={metric}
        onChange={setMetric}
        options={[
          { value: 'coffees', label: tr.t('board.coffees') },
          { value: 'caffeine', label: tr.t('board.caffeine') },
        ]}
      />
      <ol className={b.list}>
        {board.top.map((r) => (
          <li key={r.nickname}>
            <BoardRow rank={r.rank} nickname={r.nickname} value={r.value} unit={unit} isYou={r.isYou} youLabel={tr.t('board.you')} onClick={r.isYou ? openStats : undefined} />
          </li>
        ))}
      </ol>
      {board.you ? (
        <div className={b.pinned}>
          <span className={b.gap} aria-hidden="true">
            ···
          </span>
          <BoardRow rank={board.you.rank} nickname={board.you.nickname} value={board.you.value} unit={unit} isYou youLabel={tr.t('board.you')} onClick={openStats} />
        </div>
      ) : null}
      {mg > 0 ? (
        <p className={b.equivalent} aria-live="polite">
          <span>
            <RichText text={tr.t('board.caffeineOf')} nodes={{ mg: <><span className="sq-mono">{groupThousands(mg)}</span>{'\u00A0'}mg</> }} />
          </span> <span key={line} className={b.fun}>{tr.tp(eq.key, eq.pick(caffeineEquivalents(mg)))}</span>
        </p>
      ) : null}
      <Link to="/me" className="sq-link">
        {tr.t('board.yourStats')}
        <IconChevronRight size={18} />
      </Link>
    </div>
  );
}
