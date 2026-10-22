import styles from '../Screen.module.css';
import home from './HomeScreen.module.css';
import { WipNote } from '../WipNote';
import { DailyLimit } from '../../components/DailyLimit';
import { BoxMeter } from '../../components/BoxMeter';
import { StatusPill } from '../../components/StatusPill';
import { BoxTag } from '../../components/BoxTag';
import { useT, type Translator } from '../../i18n/useT';
import { drinkName, configSummary } from '../../i18n/drinkText';
import { useStore } from '../../store/useStore';
import { useActiveOrders, useBoxUsage, useDailyLimit, useNow } from '../../store/hooks';
import { greetingKey } from '../../store/selectors';
import { orderStatus } from '../../domain/orders';
import type { Order } from '../../domain/types';
import { RAJSKA } from '../../data/machines';

/** One active order. Ready is the moment: the serif line names the box, the meta says how long it waits. */
function ActiveOrderCard({ order, now, tr }: { order: Order; now: number; tr: Translator }) {
  const status = orderStatus(order, now, RAJSKA.brewMinutes);
  const ready = status === 'ready';
  const when = ready ? tr.t('pickup.heldUntil', { time: tr.time(order.holdUntil) }) : tr.t('screen.readyAt', { time: tr.time(order.readyAt) });
  return (
    <article className={[home.order, ready && home.ready].filter(Boolean).join(' ')}>
      <div className={home.orderText}>
        <StatusPill status={status} label={tr.t(`status.${status}`)} />
        {ready ? <p className={home.readyLine}>{tr.t('pickup.title', { n: order.boxId })}</p> : null}
        <p className={home.drink}>{drinkName(order.config.drinkId, tr)}</p>
        <p className={home.meta}>
          {configSummary(order.config, tr)} · {when}
        </p>
      </div>
      <BoxTag n={order.boxId} size="lg" />
    </article>
  );
}

/** Milestone 1 Home: greeting, today's allowance, the machine, and any order on its way — all live from the simulation. */
export function HomeScreen() {
  const tr = useT();
  const now = useNow();
  const profile = useStore((s) => s.profile);
  const limit = useDailyLimit();
  const usage = useBoxUsage();
  const active = useActiveOrders();
  const name = profile.displayName ?? profile.nickname ?? '';
  const waiting = active.some((o) => orderStatus(o, now, RAJSKA.brewMinutes) !== 'ready');

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <p className={styles.dateLine}>{tr.date(now)}</p>
        <h1 className={styles.display}>{tr.t(greetingKey(now), { name })}</h1>
      </header>

      <div className={styles.tiles}>
        <DailyLimit used={limit.used} max={limit.max} tr={tr} />
        <BoxMeter free={usage.free} total={usage.total} mine={usage.mine.size} tr={tr} />
      </div>

      {active.length > 0 ? (
        <section className={styles.stack} aria-label={tr.t('screen.status')}>
          {waiting ? <h2 className={styles.sectionTitle}>{tr.t('screen.activeOrder')}</h2> : null}
          {active.map((o) => (
            <ActiveOrderCard key={o.id} order={o} now={now} tr={tr} />
          ))}
        </section>
      ) : null}

      <WipNote milestone={2} message="wip.home" />
    </div>
  );
}
