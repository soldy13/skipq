import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Screen.module.css';
import home from './HomeScreen.module.css';
import { PickupSheet } from './PickupSheet';
import { DailyLimit } from '../../components/DailyLimit';
import { BoxMeter } from '../../components/BoxMeter';
import { StatusPill } from '../../components/StatusPill';
import { BoxTag } from '../../components/BoxTag';
import { Chip } from '../../components/Chip';
import { UsualCard } from '../../components/UsualCard';
import { IconChevronRight, IconClock } from '../../components/icons';
import { useOrderFlow } from '../order/useOrderFlow';
import { DOT_SEP } from '../../domain/format';
import { orderPath, slotLabel } from '../order/orderText';
import { useT, type Translator } from '../../i18n/useT';
import { configSummary, drinkName } from '../../i18n/drinkText';
import { useStore, worldOf } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useActiveOrders, useBoxUsage, useDailyLimit, useNow, useUsuals } from '../../store/hooks';
import { greetingKey } from '../../store/selectors';
import { orderStatus } from '../../domain/orders';
import { isOptionLocked, paymentOptions, type PlaceFailure } from '../../domain/ordering';
import { isValidSlotStart } from '../../domain/slots';
import type { DrinkConfig, Order } from '../../domain/types';
import { POPULAR_AT_VSE } from '../../data/drinks';
import { RAJSKA } from '../../data/machines';

/** One active order. Ready is the moment: the serif line names the box, the meta says how long it waits. */
function ActiveOrderCard({ order, now, tr, onOpen }: { order: Order; now: number; tr: Translator; onOpen: () => void }) {
  const status = orderStatus(order, now, RAJSKA.brewMinutes);
  const ready = status === 'ready';
  const when = ready ? tr.t('pickup.heldUntil', { time: tr.time(order.holdUntil) }) : tr.t('screen.readyAt', { time: tr.time(order.readyAt) });
  return (
    <button type="button" className={[home.order, ready && home.ready].filter(Boolean).join(' ')} onClick={onOpen}>
      <span className={home.orderText}>
        <StatusPill status={status} label={tr.t(`status.${status}`)} />
        {ready ? <span className={home.readyLine}>{tr.t('pickup.title', { n: order.boxId })}</span> : null}
        <span className={home.drink}>{drinkName(order.config.drinkId, tr)}</span>
        <span className={home.meta}>
          {configSummary(order.config, tr)}
          {DOT_SEP}
          {when}
        </span>
      </span>
      <BoxTag n={order.boxId} size="lg" />
    </button>
  );
}

/** What a one-tap order actually uses: options the payment can't unlock fall back to cow's milk / standard beans. */
function effectiveConfig(config: DrinkConfig, payment: Parameters<typeof isOptionLocked>[1], addons: Parameters<typeof isOptionLocked>[2]): DrinkConfig {
  const milk = config.milk && isOptionLocked({ kind: 'milk', value: config.milk }, payment, addons) ? 'cow' : config.milk;
  const bean = isOptionLocked({ kind: 'bean', value: config.bean }, payment, addons) ? 'standard' : config.bean;
  return { ...config, milk, bean };
}

export function HomeScreen() {
  const tr = useT();
  const navigate = useNavigate();
  const now = useNow();
  const profile = useStore((s) => s.profile);
  const limit = useDailyLimit();
  const usage = useBoxUsage();
  const active = useActiveOrders();
  const usuals = useUsuals();
  const pickup = useUi((s) => s.pickup);
  const setPickup = useUi((s) => s.setPickup);
  const showToast = useUi((s) => s.showToast);
  const flow = useOrderFlow();
  const [pickerOpen, setPickerOpen] = useState(false);
  const name = profile.displayName ?? profile.nickname ?? '';
  const waiting = active.some((o) => orderStatus(o, now, RAJSKA.brewMinutes) !== 'ready');

  // A chosen slot that has started (or can no longer be brewed in time) quietly falls back to Now.
  useEffect(() => {
    if (pickup !== null && !isValidSlotStart(RAJSKA, now, pickup)) setPickup(null);
  }, [pickup, now, setPickup]);

  const cards = usuals.length > 0 ? usuals.map((u) => ({ config: u.config, note: tr.tp('usual.count', u.count) })) : POPULAR_AT_VSE.map((config) => ({ config, note: tr.t('home.popular') }));

  function oneTap(config: DrinkConfig) {
    const world = worldOf(useStore.getState());
    const payment = paymentOptions(world, config, now).default;
    flow.submit(
      { config: effectiveConfig(config, payment, world.addons), slotStart: pickup, payment },
      (order) => {
        showToast({
          message: tr.t('toast.ordered', { n: order.boxId }),
          box: order.boxId,
          action: {
            label: tr.t('common.undo'),
            run: () => {
              useStore.getState().undoOrder(order.id);
              showToast({ message: tr.t('toast.undone') });
            },
          },
        });
        setPickup(null);
      },
      (reason: PlaceFailure) => {
        if (reason === 'full' || reason === 'closed' || reason === 'slot') setPickerOpen(true);
      },
    );
  }

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
            <ActiveOrderCard key={o.id} order={o} now={now} tr={tr} onOpen={() => navigate(`/order/status/${o.id}`)} />
          ))}
        </section>
      ) : null}

      <section className={styles.stack} aria-labelledby="usuals-title">
        <div className={home.usualsHead}>
          <h2 id="usuals-title" className={styles.sectionTitle}>
            {usuals.length > 0 ? tr.t('home.usuals') : tr.t('home.popular')}
          </h2>
          <Chip icon={<IconClock size={18} />} onClick={() => setPickerOpen(true)}>
            {pickup === null ? tr.t('home.pickupNow') : tr.t('home.pickupAt', { time: tr.time(pickup) })}
          </Chip>
        </div>
        {cards.map(({ config, note }) => (
          <UsualCard
            key={`${config.drinkId}-${config.milk}-${config.bean}`}
            name={drinkName(config.drinkId, tr)}
            summary={configSummary(config, tr)}
            note={note}
            orderLabel={tr.t('usual.order', { time: slotLabel(pickup, tr) })}
            onOrder={() => oneTap(config)}
            onOpen={() => navigate(orderPath(config, pickup))}
          />
        ))}
        <Link to="/menu" className={home.browse}>
          {tr.t('home.browseAll')}
          <IconChevronRight size={18} />
        </Link>
      </section>

      <PickupSheet open={pickerOpen} selected={pickup} onSelect={setPickup} onClose={() => setPickerOpen(false)} />
      {flow.sheet}
    </div>
  );
}
