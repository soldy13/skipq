import { Row, Section, State } from './Specimen';
import { StatusPill } from '../../components/StatusPill';
import { DailyLimit } from '../../components/DailyLimit';
import { BoxMeter } from '../../components/BoxMeter';
import { LockerGrid } from '../../components/LockerGrid';
import { BoxTag } from '../../components/BoxTag';
import { Button } from '../../components/Button';
import { useBoxUsage, useDailyLimit } from '../../store/hooks';
import type { OrderStatus } from '../../domain/types';
import type { Translator } from '../../i18n/useT';

const STATUSES: readonly OrderStatus[] = ['scheduled', 'brewing', 'ready', 'pickedUp', 'expired', 'cancelled'];

export function StatusSection({ tr }: { tr: Translator }) {
  const limit = useDailyLimit();
  const usage = useBoxUsage();
  return (
    <>
      <Section id="statuspill" name="StatusPill" note="Icon + word + colour, always. Brewing amber, Ready green, Expired red, Picked up grey.">
        <State label="Small">
          <Row>
            {STATUSES.map((s) => (
              <StatusPill key={s} status={s} label={tr.t(`status.${s}`)} />
            ))}
          </Row>
        </State>
        <State label="Medium">
          <Row>
            {STATUSES.slice(0, 5).map((s) => (
              <StatusPill key={s} status={s} label={tr.t(`status.${s}`)} size="md" />
            ))}
          </Row>
        </State>
        <State label="BoxTag — the locker plate (sm / md / lg)">
          <Row>
            <BoxTag n={14} size="sm" />
            <BoxTag n={14} />
            <BoxTag n={14} size="lg" />
          </Row>
        </State>
      </Section>

      <Section id="dailylimit" name="DailyLimit" note="Plan allowance today. At the limit the copy is neutral and offers Single or Pack — never red.">
        <State label="Live — from the store">
          <DailyLimit used={limit.used} max={limit.max} tr={tr} />
        </State>
        <State label="0 of 3 · 2 of 3">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DailyLimit used={0} max={3} tr={tr} />
            <DailyLimit used={2} max={3} tr={tr} />
          </div>
        </State>
        <State label="Reached — 3 of 3, with alternatives">
          <DailyLimit
            used={3}
            max={3}
            tr={tr}
            variant="banner"
            actions={
              <>
                <Button variant="secondary" compact>
                  {tr.t('payment.single')} · {tr.price(29)}
                </Button>
                <Button variant="secondary" compact>
                  {tr.t('payment.pack')}
                </Button>
              </>
            }
          />
        </State>
        <State label="Reached — 1 a day · no plan">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DailyLimit used={1} max={1} tr={tr} />
            <DailyLimit used={0} max={0} tr={tr} />
          </div>
        </State>
      </Section>

      <Section id="boxmeter" name="BoxMeter" note="One segment per door. Your box is Vanilla; amber at three or fewer.">
        <State label="Live — from the store">
          <BoxMeter free={usage.free} total={usage.total} mine={usage.mine.size} tr={tr} />
        </State>
        <State label="Plenty · few · full">
          <div style={{ display: 'grid', gap: 12 }}>
            <BoxMeter free={22} total={30} tr={tr} />
            <BoxMeter free={2} total={30} mine={1} tr={tr} />
            <BoxMeter free={0} total={30} mine={1} tr={tr} />
          </div>
        </State>
      </Section>

      <Section id="lockergrid" name="LockerGrid" note="The machine's front: 6 × 5 doors. Free · in use · yours.">
        <State label="Live — full size">
          <LockerGrid total={usage.total} inUse={usage.inUse} mine={usage.mine} tr={tr} />
        </State>
        <State label="Mini-map (pickup screen)">
          <div style={{ maxWidth: 180 }}>
            <LockerGrid total={30} inUse={new Set([1, 2, 5, 9, 11, 17, 18, 22, 23, 27])} mine={new Set([14])} tr={tr} size="mini" showLegend={false} />
          </div>
        </State>
      </Section>
    </>
  );
}
