import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import o from './OrderScreen.module.css';
import { ScreenHeader } from '../ScreenHeader';
import { useDock } from '../useDock';
import { OptionChips } from './OptionChips';
import { AddOnSheet } from './AddOnSheet';
import { DrinkInfoSheet } from './DrinkInfoSheet';
import { useOrderFlow } from './useOrderFlow';
import { paymentSegments, slotLabel } from './orderText';
import { Button, IconButton } from '../../components/Button';
import { DailyLimit } from '../../components/DailyLimit';
import { Segmented } from '../../components/Segmented';
import { SlotGrid } from '../../components/SlotGrid';
import { StrengthDots } from '../../components/StrengthDots';
import { IconInfo } from '../../components/icons';
import { BEANS, DRINKS, MILKS, drinkById } from '../../data/drinks';
import { RAJSKA } from '../../data/machines';
import { isOptionLocked, paymentOptions, type PaymentChoice } from '../../domain/ordering';
import { isValidSlotStart, nextFreeSlot } from '../../domain/slots';
import type { AddonId, Bean, DrinkConfig, DrinkId, Milk } from '../../domain/types';
import { useBookings, useNow, useSlotGrid, useWorld } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { drinkMeta, drinkName, drinkNameInline } from '../../i18n/drinkText';

const CTA_DOCK = 84;

function parseParams(drinkId: DrinkId, params: URLSearchParams): { milk: Milk | null; bean: Bean; slot: number | null } {
  const isMilk = drinkById(drinkId).type === 'milk';
  const milkParam = params.get('milk') as Milk | null;
  const beanParam = params.get('bean') as Bean | null;
  const slotParam = Number(params.get('slot'));
  return {
    milk: isMilk ? (milkParam && MILKS.includes(milkParam) ? milkParam : 'cow') : null,
    bean: beanParam && BEANS.includes(beanParam) ? beanParam : 'standard',
    slot: Number.isFinite(slotParam) && slotParam > 0 ? slotParam : null,
  };
}

export function OrderScreen() {
  const { drinkId } = useParams();
  const known = DRINKS.some((d) => d.id === drinkId);
  return known ? <OrderForm drinkId={drinkId as DrinkId} /> : <NotFound />;
}

function NotFound() {
  const tr = useT();
  return (
    <div className={styles.screen}>
      <ScreenHeader />
      <h1 className={styles.title}>{tr.t('order.notFound')}</h1>
    </div>
  );
}

function OrderForm({ drinkId }: { drinkId: DrinkId }) {
  const tr = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = useMemo(() => parseParams(drinkId, params), [drinkId, params]);
  const now = useNow();
  const world = useWorld();
  const grid = useSlotGrid();
  const bookings = useBookings();
  const flow = useOrderFlow();
  const [milk, setMilk] = useState(initial.milk);
  const [bean, setBean] = useState(initial.bean);
  const [slot, setSlot] = useState<number | null>(initial.slot);
  const [chosenPayment, setChosenPayment] = useState<PaymentChoice | null>(null);
  const [addon, setAddon] = useState<AddonId | null>(null);
  const [info, setInfo] = useState(false);
  useDock(CTA_DOCK);

  const drink = drinkById(drinkId);
  const opts = paymentOptions(world, { drinkId, milk, bean }, now);
  const payment = opts.options.find((x) => x.method === chosenPayment && x.available)?.method ?? opts.default;
  const planOption = opts.options.find((x) => x.method === 'plan');

  // What will actually be ordered: options this payment can't unlock fall back to cow's milk / standard beans.
  const config: DrinkConfig = {
    drinkId,
    milk: milk && isOptionLocked({ kind: 'milk', value: milk }, payment, world.addons) ? 'cow' : milk,
    bean: isOptionLocked({ kind: 'bean', value: bean }, payment, world.addons) ? 'standard' : bean,
  };

  // Slot: a chosen one that has passed falls back to Now; Now falls back to the first open slot when unusable.
  const nowUsable = grid.now.available && grid.now.state !== 'full';
  const chosen = slot !== null && isValidSlotStart(RAJSKA, now, slot) ? slot : null;
  const firstOpen = grid.slots.find((s) => s.state !== 'full')?.start ?? null;
  const pickup = chosen ?? (nowUsable ? null : firstOpen);
  const pickupFull = pickup === null ? !nowUsable : grid.slots.find((s) => s.start === pickup)?.state === 'full';
  const nextFree = pickupFull ? nextFreeSlot(RAJSKA, now, bookings) : null;

  function submit() {
    flow.submit({ config, slotStart: pickup, payment }, (order) => navigate(`/order/status/${order.id}`, { replace: true }));
  }

  return (
    <div className={`${styles.screen} ${o.screen}`}>
      <ScreenHeader trailing={<IconButton label={tr.t('common.info', { drink: drinkName(drinkId, tr) })} icon={<IconInfo />} tone="filled" onClick={() => setInfo(true)} />} />
      <header className={styles.header}>
        <h1 className={styles.title}>{drinkName(drinkId, tr)}</h1>
        <p className={o.meta}>
          <span>{drinkMeta(drinkId, tr)}</span>
          <StrengthDots value={drink.strength} label={tr.t('compare.strengthOf', { n: drink.strength })} />
        </p>
      </header>

      <section className={o.section}>
        <OptionChips tr={tr} payment={payment} addons={world.addons} milk={config.milk} bean={config.bean} onMilk={setMilk} onBean={setBean} onLocked={setAddon} />
      </section>

      <section className={o.section}>
        <SlotGrid grid={grid} selected={pickup} onSelect={setSlot} now={now} tr={tr} />
      </section>

      <section className={o.section} aria-labelledby="pay-title">
        <h3 id="pay-title" className={o.label}>
          {tr.t('payment.title')}
        </h3>
        <Segmented<PaymentChoice> label={tr.t('payment.title')} value={payment} onChange={setChosenPayment} options={paymentSegments(opts, tr)} />
        {planOption?.reason === 'limit' ? <DailyLimit used={planOption.used ?? 0} max={planOption.max ?? 0} tr={tr} variant="banner" /> : null}
        {planOption?.reason === 'notCovered' ? (
          <Button variant="tertiary" className={o.upgrade} onClick={() => navigate('/plans')}>
            {tr.t('payment.upgrade')}
          </Button>
        ) : null}
      </section>

      <div className={o.dock}>
        {pickupFull ? (
          <Button block variant="secondary" disabled={nextFree === null} onClick={() => nextFree !== null && setSlot(nextFree)}>
            {nextFree === null ? tr.t('boxes.full') : tr.t('slot.nextFree', { time: tr.time(nextFree) })}
          </Button>
        ) : (
          <Button block onClick={submit}>
            {tr.t('order.cta', { drink: drinkNameInline(drinkId, tr), time: slotLabel(pickup, tr) })}
          </Button>
        )}
      </div>

      <AddOnSheet addon={addon} onClose={() => setAddon(null)} />
      <DrinkInfoSheet drinkId={info ? drinkId : null} onClose={() => setInfo(false)} />
      {flow.sheet}
    </div>
  );
}
