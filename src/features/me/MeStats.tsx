import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import m from './MeScreen.module.css';
import { StatTile } from '../../components/StatTile';
import { WeekBars } from '../../components/WeekBars';
import { IconBolt, IconChevronRight, IconCup, IconFlame, IconStar } from '../../components/icons';
import { boardRows, caffeineEquivalents, yourRank } from '../../domain/board';
import { formatOrdinal, formatShortDay } from '../../domain/format';
import { caffeineThisMonth, coffeesThisMonth, favouriteDrink, streak, weeklyCounts } from '../../domain/stats';
import { useNow, useWorld } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { drinkName } from '../../i18n/drinkText';

/** Personal stats (brief §4.8): this month's coffees (and board place), caffeine, favourite, weekday streak, last four weeks. */
export function MeStats() {
  const tr = useT();
  const now = useNow();
  const world = useWorld();
  const orders = world.orders;
  const stats = useMemo(
    () => ({
      coffees: coffeesThisMonth(orders, now),
      mg: caffeineThisMonth(orders, now),
      fav: favouriteDrink(orders, now),
      streak: streak(orders, now),
      weeks: weeklyCounts(orders, now, 4),
      rank: yourRank(boardRows(world, 'coffees', now)),
    }),
    [world, orders, now],
  );

  // Before the first pickup there is nothing to count; one sentence and a way in beat a grid of zeros.
  if (!orders.some((o) => o.pickedUpAt !== null && o.pickedUpAt <= now)) {
    return (
      <section className={m.section} aria-labelledby="stats-title">
        <h2 id="stats-title" className={m.heading}>
          {tr.t('me.stats')}
        </h2>
        <div className={m.empty}>
          <p className={m.body}>{tr.t('stat.empty')}</p>
          <Link to="/menu" className="sq-link">
            {tr.t('home.browseAll')}
            <IconChevronRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={m.section} aria-labelledby="stats-title">
      <h2 id="stats-title" className={m.heading}>
        {tr.t('me.stats')}
      </h2>
      <div className={m.tiles}>
        <StatTile icon={<IconCup />} label={tr.t('stat.coffees')} value={stats.coffees} sub={stats.rank ? tr.t('stat.rank', { rank: formatOrdinal(stats.rank, tr.lang) }) : undefined} />
        <StatTile icon={<IconBolt />} label={tr.t('stat.caffeine')} value={stats.mg} unit="mg" sub={stats.mg > 0 ? tr.tp('stat.eqRedBull', caffeineEquivalents(stats.mg).redBull) : undefined} />
        <StatTile icon={<IconStar />} label={tr.t('stat.favourite')} value={stats.fav ? drinkName(stats.fav, tr) : '—'} textValue />
        <StatTile icon={<IconFlame />} label={tr.t('stat.streak')} value={stats.streak} sub={tr.tp('stat.streakUnit', stats.streak)} />
      </div>
      <WeekBars
        title={tr.t('stat.weeks')}
        bars={stats.weeks.map((w, i) => {
          const current = i === stats.weeks.length - 1;
          const day = formatShortDay(w.from, tr.lang);
          return {
            label: current ? tr.t('stat.thisWeek') : day,
            value: w.count,
            description: current ? tr.t('stat.weekBarNow', { n: w.count }) : tr.t('stat.weekBar', { day, n: w.count }),
          };
        })}
      />
    </section>
  );
}
