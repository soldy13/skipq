import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import o from '../order/OrderScreen.module.css';
import g from './Gift.module.css';
import { giftFromLine, redeemErrorText, redeemFailureText } from './giftText';
import { ScreenHeader } from '../ScreenHeader';
import { CTA_DOCK, useDock } from '../useDock';
import { slotLabel } from '../order/orderText';
import { Button } from '../../components/Button';
import { Chip, ChipGroup } from '../../components/Chip';
import { SlotGrid } from '../../components/SlotGrid';
import { MILKS, drinkById } from '../../data/drinks';
import { RAJSKA } from '../../data/machines';
import { checkRedeem, type RedeemError } from '../../domain/giving';
import { isValidSlotStart } from '../../domain/slots';
import type { Milk } from '../../domain/types';
import { useStore, worldOf } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useNow, useSlotGrid } from '../../store/hooks';
import { useT } from '../../i18n/useT';


/** Brief F12: a valid code shows the gifted drink; the receiver may change the milk and picks a time. No payment. */
export function RedeemScreen() {
  const { code = '' } = useParams();
  // Checked once on arrival: redeeming it here would otherwise flip this screen to "already redeemed".
  const [check] = useState(() => {
    const s = useStore.getState();
    return checkRedeem(worldOf(s), code, s.clock.now);
  });
  if (!check.ok) return <RedeemProblem error={check.error} />;
  return <RedeemForm code={code} />;
}

function RedeemProblem({ error }: { error: RedeemError }) {
  const tr = useT();
  const navigate = useNavigate();
  return (
    <div className={styles.screen}>
      <ScreenHeader fallback="/gift?tab=redeem" />
      <h1 className={styles.title}>{tr.t('gift.notFound')}</h1>
      <p className={g.lead}>{redeemErrorText(error, tr)}</p>
      <Button block variant="secondary" onClick={() => navigate('/gift?tab=redeem')}>
        {tr.t('nav.back')}
      </Button>
    </div>
  );
}

function RedeemForm({ code }: { code: string }) {
  const tr = useT();
  const navigate = useNavigate();
  const now = useNow();
  const grid = useSlotGrid();
  const gift = useStore((s) => s.gifts.find((x) => x.code === code));
  const redeemGift = useStore((s) => s.redeemGift);
  const showToast = useUi((s) => s.showToast);
  const [milk, setMilk] = useState<Milk | null>(gift?.config.milk ?? null);
  const [slot, setSlot] = useState<number | null>(null);
  useDock(CTA_DOCK);

  if (!gift) return null;
  const isMilk = drinkById(gift.config.drinkId).type === 'milk';
  const chosen = slot !== null && isValidSlotStart(RAJSKA, now, slot) ? slot : null;
  const firstOpen = grid.slots.find((s) => s.state !== 'full')?.start ?? null;
  const pickup = chosen ?? (grid.now.available && grid.now.state !== 'full' ? null : firstOpen);

  function redeem() {
    const result = redeemGift(code, { milk, slotStart: pickup });
    if (result.ok) navigate(`/order/status/${result.order.id}`, { replace: true });
    else showToast({ message: redeemFailureText(result.reason, tr) });
  }

  return (
    <div className={`${styles.screen} ${o.screen}`}>
      <ScreenHeader fallback="/gift?tab=redeem" />
      <header className={styles.header}>
        <h1 className={styles.title}>{giftFromLine(gift, tr)}</h1>
        <p className={g.note}>{isMilk ? tr.t('gift.drinkFixed') : tr.t('gift.redeemNote')}</p>
      </header>

      {isMilk ? (
        <section className={o.options}>
          <ChipGroup label={tr.t('milk.label')} showLabel>
            {MILKS.map((m) => (
              <Chip key={m} selected={milk === m} onClick={() => setMilk(m)}>
                {tr.t(`milk.${m}`)}
              </Chip>
            ))}
          </ChipGroup>
        </section>
      ) : null}

      <section className={o.section}>
        <SlotGrid grid={grid} selected={pickup} onSelect={setSlot} now={now} tr={tr} />
        {isMilk ? <p className={g.note}>{tr.t('gift.redeemNote')}</p> : null}
      </section>

      <div className={o.dock}>
        <Button block onClick={redeem}>
          {tr.t('gift.redeemCta', { time: slotLabel(pickup, tr) })}
        </Button>
      </div>
    </div>
  );
}
