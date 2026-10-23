import { useId, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import o from '../order/OrderScreen.module.css';
import g from './Gift.module.css';
import { ScreenHeader } from '../ScreenHeader';
import { useDock } from '../useDock';
import { OptionChips } from '../order/OptionChips';
import { AddOnSheet } from '../order/AddOnSheet';
import { CheckoutSheet } from '../order/CheckoutSheet';
import { failureMessage, paymentSegments } from '../order/orderText';
import { Button } from '../../components/Button';
import { Segmented } from '../../components/Segmented';
import { DRINKS, defaultConfig, drinkById } from '../../data/drinks';
import { SINGLE_PRICE } from '../../data/pricing';
import { DOT_SEP } from '../../domain/format';
import { isOptionLocked, paymentOptions, type PaymentChoice } from '../../domain/ordering';
import type { AddonId, DrinkConfig, DrinkId } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useNow, useWorld } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { configSummary, drinkName, drinkNameInline } from '../../i18n/drinkText';

const CTA_DOCK = 80;
const MAX_NAME = 24;

export function GiftSendScreen() {
  const { drinkId } = useParams();
  const tr = useT();
  if (!DRINKS.some((d) => d.id === drinkId)) {
    return (
      <div className={styles.screen}>
        <ScreenHeader fallback="/gift" />
        <h1 className={styles.title}>{tr.t('order.notFound')}</h1>
      </div>
    );
  }
  return <SendForm drinkId={drinkId as DrinkId} />;
}

/** Brief F11: drink → options → pay (plan / pack / single) → code. A plan gift uses today's allowance. */
function SendForm({ drinkId }: { drinkId: DrinkId }) {
  const tr = useT();
  const navigate = useNavigate();
  const nameId = useId();
  const now = useNow();
  const world = useWorld();
  const sendGift = useStore((s) => s.sendGift);
  const showToast = useUi((s) => s.showToast);
  const initial = defaultConfig(drinkId);
  const [milk, setMilk] = useState(initial.milk);
  const [bean, setBean] = useState(initial.bean);
  const [toName, setToName] = useState('');
  const [chosenPayment, setChosenPayment] = useState<PaymentChoice | null>(null);
  const [addon, setAddon] = useState<AddonId | null>(null);
  const [paying, setPaying] = useState(false);
  useDock(CTA_DOCK);

  const opts = paymentOptions(world, { drinkId, milk, bean }, now);
  const payment = opts.options.find((x) => x.method === chosenPayment && x.available)?.method ?? opts.default;
  const config: DrinkConfig = {
    drinkId,
    milk: milk && isOptionLocked({ kind: 'milk', value: milk }, payment, world.addons) ? 'cow' : milk,
    bean: isOptionLocked({ kind: 'bean', value: bean }, payment, world.addons) ? 'standard' : bean,
  };

  function send() {
    const result = sendGift({ config, payment, toName });
    if (result.ok) navigate(`/gift/code/${result.gift.code}`, { replace: true });
    else showToast({ message: failureMessage(result.reason, tr) });
  }

  return (
    <div className={`${styles.screen} ${o.screen}`}>
      <ScreenHeader fallback="/gift/send" />
      <header className={styles.header}>
        <h1 className={styles.title}>{drinkName(drinkId, tr)}</h1>
        <p className={o.meta}>{tr.t('gift.as')}</p>
      </header>

      <section className={o.options}>
        <OptionChips tr={tr} payment={payment} addons={world.addons} milk={drinkById(drinkId).type === 'milk' ? config.milk : null} bean={config.bean} onMilk={setMilk} onBean={setBean} onLocked={setAddon} />
      </section>

      <section className={g.field}>
        <label htmlFor={nameId} className={g.fieldLabel}>
          {tr.t('gift.for')}
        </label>
        <input id={nameId} className={g.input} value={toName} maxLength={MAX_NAME} autoComplete="off" onChange={(e) => setToName(e.target.value)} aria-describedby={`${nameId}-hint`} />
        <p id={`${nameId}-hint`} className={g.note}>
          {tr.t('gift.forHint')}
        </p>
      </section>

      <section className={o.section} aria-labelledby="gift-pay">
        <h3 id="gift-pay" className={o.label}>
          {tr.t('payment.title')}
        </h3>
        <Segmented<PaymentChoice> label={tr.t('payment.title')} value={payment} onChange={setChosenPayment} options={paymentSegments(opts, tr)} />
        <p className={g.note}>{tr.t('gift.valid')}</p>
      </section>

      <div className={o.dock}>
        <Button block onClick={() => (payment === 'single' ? setPaying(true) : send())}>
          {tr.t('gift.sendCta', { drink: drinkNameInline(drinkId, tr) })}
        </Button>
      </div>

      <AddOnSheet addon={addon} onClose={() => setAddon(null)} />
      <CheckoutSheet
        open={paying}
        onClose={() => setPaying(false)}
        lines={[{ label: tr.t('gift.as'), value: `${drinkName(drinkId, tr)}${DOT_SEP}${configSummary(config, tr)}` }]}
        amount={SINGLE_PRICE}
        onPaid={() => {
          setPaying(false);
          send();
        }}
      />
    </div>
  );
}
