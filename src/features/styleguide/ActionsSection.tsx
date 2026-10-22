import { useState } from 'react';
import { Row, Section, State } from './Specimen';
import { Button, IconButton } from '../../components/Button';
import { Chip, ChipGroup } from '../../components/Chip';
import { SlotChip } from '../../components/SlotChip';
import { SlotGrid } from '../../components/SlotGrid';
import { Segmented } from '../../components/Segmented';
import { Switch } from '../../components/Switch';
import { CodeInput } from '../../components/CodeInput';
import { IconInfo, IconUnlock, IconClose } from '../../components/icons';
import { RAJSKA } from '../../data/machines';
import { DEMO_START } from '../../domain/clock';
import { buildSlotGrid, nextFreeSlot } from '../../domain/slots';
import { atClock } from '../../domain/time';
import type { Booking, PaymentMethod } from '../../domain/types';
import { useNow, useSlotGrid } from '../../store/hooks';
import type { Translator } from '../../i18n/useT';

const at = (hhmm: string) => atClock(DEMO_START, hhmm);

/** Bookings for one window only (like the demo's "Fill next slot"), so a specimen shows exactly one busy slot. */
function block(count: number, from: number, until: number, tag: string): Booking[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${tag}${i}`, boxId: i + 1, bookedAt: from, needFrom: from, until, releasedAt: null }));
}

/** 10:30 has three boxes left, 11:15 is full. */
const BUSY = [...block(27, at('10:30'), at('10:43'), 'a'), ...block(30, at('11:15'), at('11:28'), 'b')];
/** Every box held all morning: the machine is full. */
const FULL = block(30, at('09:00'), at('12:30'), 'c');

export function ActionsSection({ tr }: { tr: Translator }) {
  const now = useNow();
  const live = useSlotGrid();
  const [slot, setSlot] = useState<number | null>(null);
  const [busySlot, setBusySlot] = useState<number | null>(at('10:30'));
  const [pay, setPay] = useState<PaymentMethod>('plan');
  const [code, setCode] = useState('');
  const [milk, setMilk] = useState<'cow' | 'oat' | 'soy'>('oat');
  const [on, setOn] = useState(true);
  const fullNext = nextFreeSlot(RAJSKA, DEMO_START, FULL);

  return (
    <>
      <Section id="button" name="Button" note="Primary (one per screen) · secondary · tertiary · unlock (Espresso, 64 px) · icon (44 × 44).">
        <State label="Primary — default / disabled / loading">
          <Row>
            <Button block>{tr.t('order.cta', { drink: 'flat white', time: '10:30' })}</Button>
            <Button block disabled>
              {tr.t('order.cta', { drink: 'flat white', time: '10:30' })}
            </Button>
            <Button block loading loadingLabel={tr.t('common.loading')}>
              Pay
            </Button>
          </Row>
        </State>
        <State label="Secondary · tertiary">
          <Row>
            <Button variant="secondary">{tr.t('usual.order', { time: tr.t('common.now') })}</Button>
            <Button variant="secondary" disabled>
              {tr.t('usual.order', { time: tr.t('common.now') })}
            </Button>
            <Button variant="tertiary">{tr.t('payment.upgrade')}</Button>
            <Button variant="tertiary" disabled>
              {tr.t('payment.upgrade')}
            </Button>
          </Row>
        </State>
        <State label="Unlock — default / unlocking">
          <Row>
            <Button variant="unlock" block icon={<IconUnlock />}>
              {tr.t('pickup.unlock', { n: 14 })}
            </Button>
            <Button variant="unlock" block loading loadingLabel={tr.t('pickup.unlocking')}>
              {tr.t('pickup.unlock', { n: 14 })}
            </Button>
          </Row>
        </State>
        <State label="Icon — plain / filled / disabled">
          <Row>
            <IconButton label={tr.t('common.info', { drink: 'Flat white' })} icon={<IconInfo />} />
            <IconButton label={tr.t('common.close')} icon={<IconClose />} tone="filled" />
            <IconButton label={tr.t('common.close')} icon={<IconClose />} disabled />
          </Row>
        </State>
      </Section>

      <Section id="chip" name="Chip" note="Milk and bean options. Selected is Vanilla with a check. A locked chip needs an add-on and stays tappable.">
        <State label="Milk — interactive">
          <ChipGroup label={tr.t('milk.label')}>
            {(['cow', 'oat', 'soy'] as const).map((m) => (
              <Chip key={m} selected={milk === m} onClick={() => setMilk(m)}>
                {tr.t(`milk.${m}`)}
              </Chip>
            ))}
          </ChipGroup>
        </State>
        <State label="Beans — locked add-on / disabled">
          <ChipGroup label={tr.t('bean.label')}>
            <Chip selected>{tr.t('bean.standard')}</Chip>
            <Chip locked badge={tr.t('chip.addon')}>
              {tr.t('bean.premium')}
            </Chip>
            <Chip disabled>{tr.t('bean.adaptogenic')}</Chip>
          </ChipGroup>
        </State>
      </Section>

      <Section id="slotchip" name="SlotChip" note="56 px. Open · selected · few left (amber, ≤ 3) · full (struck, disabled) · Now.">
        <State label="All states">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <SlotChip isNow label={tr.t('common.now')} sublabel={tr.t('slot.eta', { n: 2 })} state="open" />
            <SlotChip label="10:30" state="open" selected />
            <SlotChip label="10:45" state="open" />
            <SlotChip label="11:00" state="few" sublabel={tr.tp('slot.left', 3)} />
            <SlotChip label="11:15" state="few" sublabel={tr.tp('slot.left', 1)} selected />
            <SlotChip label="11:30" state="full" sublabel={tr.t('slot.full')} />
          </div>
        </State>
      </Section>

      <Section id="slotgrid" name="SlotGrid" note="Now plus the next 8 slots of one opening day. Full slots stay in the grid.">
        <State label="Live — from the simulated machine">
          <SlotGrid grid={live} selected={slot} onSelect={setSlot} now={now} tr={tr} />
        </State>
        <State label="Busy morning — 3 left at 10:30, 11:15 full">
          <SlotGrid grid={buildSlotGrid(RAJSKA, DEMO_START, BUSY)} selected={busySlot} onSelect={setBusySlot} now={DEMO_START} tr={tr} />
        </State>
        <State label="Machine full (30/30)">
          <SlotGrid grid={buildSlotGrid(RAJSKA, DEMO_START, FULL)} selected={null} onSelect={() => undefined} now={DEMO_START} tr={tr} />
          {fullNext ? (
            <Button block disabled style={{ marginTop: 16 }}>
              {tr.t('slot.nextFree', { time: tr.time(fullNext) })}
            </Button>
          ) : null}
        </State>
        <State label="Closed — Friday 19:30, Monday's slots">
          <SlotGrid grid={buildSlotGrid(RAJSKA, new Date(2026, 9, 23, 19, 30).getTime(), [])} selected={null} onSelect={() => undefined} now={new Date(2026, 9, 23, 19, 30).getTime()} tr={tr} />
        </State>
      </Section>

      <Section id="segmented" name="Segmented" note="Radio group. Disabled options keep their place and say why, in neutral words.">
        <State label="Payment — all available">
          <Segmented<PaymentMethod>
            label={tr.t('payment.title')}
            value={pay}
            onChange={setPay}
            options={[
              { value: 'plan', label: tr.t('payment.plan'), sublabel: tr.t('limit.counter', { used: 2, max: 3 }) },
              { value: 'pack', label: tr.t('payment.pack'), sublabel: tr.tp('payment.packLeft', 27) },
              { value: 'single', label: tr.t('payment.single'), sublabel: tr.price(29) },
            ]}
          />
        </State>
        <State label="Plan used up for today">
          <Segmented<PaymentMethod>
            label={tr.t('payment.title')}
            value="single"
            onChange={() => undefined}
            options={[
              { value: 'plan', label: tr.t('payment.plan'), sublabel: tr.t('limit.counter', { used: 3, max: 3 }), disabled: true, reason: tr.t('limit.reached') },
              { value: 'pack', label: tr.t('payment.pack'), sublabel: tr.tp('payment.packLeft', 1) },
              { value: 'single', label: tr.t('payment.single'), sublabel: tr.price(29) },
            ]}
          />
        </State>
        <State label="Milk drink on the Black plan">
          <Segmented<PaymentMethod>
            label={tr.t('payment.title')}
            value="single"
            onChange={() => undefined}
            options={[
              { value: 'plan', label: tr.t('payment.plan'), disabled: true, reason: tr.t('payment.notCovered') },
              { value: 'single', label: tr.t('payment.single'), sublabel: tr.price(29) },
            ]}
          />
          <Button variant="tertiary" style={{ marginTop: 8 }}>
            {tr.t('payment.upgrade')}
          </Button>
        </State>
      </Section>

      <Section id="switch" name="Switch" note={'role="switch", 52 × 32 inside a 44 px target.'}>
        <State label="On / off / disabled">
          <Row>
            <Switch checked={on} onChange={setOn} label="Demo switch" />
            <Switch checked={!on} onChange={(v) => setOn(!v)} label="Demo switch inverted" />
            <Switch checked={false} onChange={() => undefined} label="Disabled" disabled />
            <Switch checked onChange={() => undefined} label="Disabled on" disabled />
          </Row>
        </State>
      </Section>

      <Section id="codeinput" name="CodeInput" note="Uppercases, inserts the dash, drops I, L, O, 0 and 1. Try typing 7m4t.">
        <State label="Interactive">
          <CodeInput value={code} onChange={setCode} label={tr.t('code.label')} hint={tr.t('code.hint')} />
        </State>
        <State label="Complete">
          <CodeInput value="SKQ-7M4T" onChange={() => undefined} label={tr.t('code.label')} />
        </State>
        <State label="Errors — unknown / redeemed / expired / own">
          <div style={{ display: 'grid', gap: 20 }}>
            <CodeInput value="SKQ-ZZZZ" onChange={() => undefined} label={tr.t('code.label')} error={tr.t('code.error.unknown')} />
            <CodeInput value="SKQ-2KQX" onChange={() => undefined} label={tr.t('code.label')} error={tr.t('code.error.redeemed')} />
            <CodeInput value="SKQ-9PRW" onChange={() => undefined} label={tr.t('code.label')} error={tr.t('code.error.expired')} />
            <CodeInput value="SKQ-4H7P" onChange={() => undefined} label={tr.t('code.label')} error={tr.t('code.error.own')} />
          </div>
        </State>
      </Section>
    </>
  );
}
