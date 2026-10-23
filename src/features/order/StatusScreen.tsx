import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import s from './StatusScreen.module.css';
import { ScreenHeader } from '../ScreenHeader';
import { useDock } from '../useDock';
import { orderPath } from './orderText';
import { Button } from '../../components/Button';
import { RichText } from '../../components/RichText';
import { BoxTag } from '../../components/BoxTag';
import { LockerGrid } from '../../components/LockerGrid';
import { StatusPill } from '../../components/StatusPill';
import { IconCheck, IconUnlock } from '../../components/icons';
import { RAJSKA } from '../../data/machines';
import { canExtend } from '../../domain/ordering';
import { DOT_SEP } from '../../domain/format';
import { orderStatus } from '../../domain/orders';
import { MINUTE } from '../../domain/time';
import type { Order, OrderStatus } from '../../domain/types';
import { useStore, worldOf } from '../../store/useStore';
import { useBoxUsage, useNow } from '../../store/hooks';
import { useT, type Translator } from '../../i18n/useT';
import { configSummary, drinkName } from '../../i18n/drinkText';

/** Dock height: 12 top + 64 unlock button + 16 bottom (same bar as the order CTA). */
const UNLOCK_DOCK = 92;
const UNLOCK_MS = 1000;

function countdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function StatusScreen() {
  const { orderId } = useParams();
  const order = useStore((st) => st.orders.find((x) => x.id === orderId));
  const tr = useT();
  if (!order) {
    return (
      <div className={styles.screen}>
        <ScreenHeader />
        <h1 className={styles.title}>{tr.t('status.notFound')}</h1>
      </div>
    );
  }
  return <OrderStatusView order={order} tr={tr} />;
}

/** Brewing starts → ready in box N → held until: the state machine as a three-step track. */
function Timeline({ order, status, tr }: { order: Order; status: OrderStatus; tr: Translator }) {
  const brewAt = order.readyAt - RAJSKA.brewMinutes * MINUTE;
  const reached = { brew: status !== 'scheduled', ready: status === 'ready', hold: false };
  const rows = [
    { key: 'brew', label: tr.t('status.step.brew'), time: brewAt, done: reached.brew },
    { key: 'ready', label: tr.t('status.step.ready', { n: order.boxId }), time: order.readyAt, done: reached.ready },
    { key: 'hold', label: tr.t('status.step.hold'), time: order.holdUntil, done: reached.hold },
  ];
  return (
    <ol className={s.timeline}>
      {rows.map((r) => (
        <li key={r.key} className={r.done ? s.done : undefined}>
          <span className={s.dot} aria-hidden="true" />
          <span className={s.stepLabel}>{r.label}</span>
          <span className={`${s.stepTime} sq-mono`}>{tr.time(r.time)}</span>
        </li>
      ))}
    </ol>
  );
}

function OrderStatusView({ order, tr }: { order: Order; tr: Translator }) {
  const navigate = useNavigate();
  const now = useNow();
  const usage = useBoxUsage();
  const unlockOrder = useStore((st) => st.unlockOrder);
  const extendOrder = useStore((st) => st.extendOrder);
  const extendable = useStore((st) => canExtend(worldOf(st), order.id, st.clock.now));
  const [phase, setPhase] = useState<'idle' | 'unlocking' | 'opened'>('idle');
  const status = orderStatus(order, now, RAJSKA.brewMinutes);
  const ready = status === 'ready';
  useDock(ready && phase === 'idle' ? UNLOCK_DOCK : 0);

  useEffect(() => {
    if (phase !== 'unlocking') return;
    const timer = window.setTimeout(() => {
      unlockOrder(order.id);
      navigator.vibrate?.(30);
      setPhase('opened');
    }, UNLOCK_MS);
    return () => window.clearTimeout(timer);
  }, [phase, order.id, unlockOrder]);

  const opened = phase === 'opened';
  const title = opened
    ? tr.t('pickup.opened', { n: order.boxId })
    : ready || phase === 'unlocking'
      ? tr.t('pickup.title', { n: order.boxId })
      : status === 'scheduled'
        ? tr.t('status.title.scheduled', { time: tr.time(order.readyAt) })
        : tr.t(`status.title.${status === 'brewing' ? 'brewing' : status}`);
  const shownStatus: OrderStatus = phase === 'unlocking' ? 'ready' : status;

  return (
    <div className={`${styles.screen} ${s.screen}`}>
      <ScreenHeader trailing={<StatusPill status={shownStatus} label={tr.t(`status.${shownStatus}`)} size="md" />} />

      <header className={styles.header}>
        <h1 className={ready || opened || phase === 'unlocking' ? `${styles.display} ${s.moment}` : styles.title} aria-live="polite">
          {title}
        </h1>
        <p className={s.drink}>
          {drinkName(order.config.drinkId, tr)}
          {DOT_SEP}
          {configSummary(order.config, tr)}
        </p>
      </header>

      {opened ? (
        <div className={s.opened}>
          <span className={s.openedMark} aria-hidden="true">
            <IconCheck size={36} />
          </span>
          <BoxTag n={order.boxId} size="lg" />
        </div>
      ) : null}

      {(status === 'scheduled' || status === 'brewing') && !opened ? (
        <>
          <section className={s.card}>
            <div className={s.readyTop}>
              <BoxTag n={order.boxId} size="lg" />
              <div className={s.hold}>
                <span>{tr.t('status.boxReserved')}</span>
                {status === 'brewing' ? (
                  <span className={s.leftLine}>{tr.t('status.brewingEta', { n: Math.max(1, Math.ceil((order.readyAt - now) / MINUTE)) })}</span>
                ) : null}
              </div>
            </div>
            <div className={s.map}>
              <LockerGrid total={usage.total} inUse={usage.inUse} mine={new Set([order.boxId])} tr={tr} size="mini" showLegend={false} />
            </div>
          </section>
          <Timeline order={order} status={status} tr={tr} />
        </>
      ) : null}

      {(ready || phase === 'unlocking') && !opened ? (
        <section className={`${s.card} ${s.readyCard}`}>
          <div className={s.readyTop}>
            <BoxTag n={order.boxId} size="lg" />
            <div className={s.hold}>
              <span>{tr.t('pickup.heldUntil', { time: tr.time(order.holdUntil) })}</span>
              <span className={s.leftLine}>
                <RichText text={tr.t('status.left')} nodes={{ time: <span className={`${s.left} sq-mono`}>{countdown(order.holdUntil - now)}</span> }} />
              </span>
            </div>
          </div>
          <div className={s.map}>
            <LockerGrid total={usage.total} inUse={usage.inUse} mine={new Set([order.boxId])} tr={tr} size="mini" showLegend={false} />
          </div>
          {extendable ? (
            <Button variant="secondary" block onClick={() => extendOrder(order.id)}>
              {tr.t('pickup.extend', { time: tr.time(order.holdUntil + RAJSKA.slotMinutes * MINUTE) })}
            </Button>
          ) : order.extended ? (
            <p className={s.note}>{tr.t('pickup.extended')}</p>
          ) : null}
        </section>
      ) : null}

      {status === 'expired' ? <p className={s.body}>{tr.t('status.expiredBody', { n: order.boxId, time: tr.time(order.holdUntil) })}</p> : null}
      {status === 'pickedUp' && order.pickedUpAt !== null ? (
        <p className={s.body}>{tr.t('status.pickedUpBody', { time: tr.time(order.pickedUpAt), n: order.boxId })}</p>
      ) : null}

      <div className={s.actions}>
        {status === 'expired' ? (
          <>
            <Button block onClick={() => navigate(orderPath(order.config))}>
              {tr.t('status.orderAgain')}
            </Button>
            <Button block variant="secondary" onClick={() => navigate('/')}>
              {tr.t('nav.home')}
            </Button>
          </>
        ) : status === 'pickedUp' || status === 'cancelled' ? (
          <Button block variant="secondary" onClick={() => navigate('/')}>
            {tr.t('nav.home')}
          </Button>
        ) : null}
      </div>

      {(ready || phase === 'unlocking') && !opened ? (
        <div className={s.dock}>
          <Button
            variant="unlock"
            block
            icon={<IconUnlock />}
            loading={phase === 'unlocking'}
            loadingLabel={tr.t('pickup.unlocking')}
            onClick={() => setPhase('unlocking')}
          >
            {tr.t('pickup.unlock', { n: order.boxId })}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
