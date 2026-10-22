import { useState } from 'react';
import { Section, Stage, State } from './Specimen';
import { UsualCard } from '../../components/UsualCard';
import { DrinkRow } from '../../components/DrinkRow';
import { DrinkCompare } from '../../components/DrinkCompare';
import { PlanCard } from '../../components/PlanCard';
import { AddOnRow } from '../../components/AddOnRow';
import { PackTile } from '../../components/PackTile';
import { GiftCode } from '../../components/GiftCode';
import { BoardRow } from '../../components/BoardRow';
import { StatTile } from '../../components/StatTile';
import { ComingSoonTile } from '../../components/ComingSoonTile';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { IconBolt, IconCup, IconFlame, IconHeart } from '../../components/icons';
import { DRINKS, POPULAR_AT_VSE } from '../../data/drinks';
import { ADDON_IDS, ADDON_PRICES, PACKS, PLAN_PRICES } from '../../data/pricing';
import { LEADERBOARD } from '../../data/leaderboard';
import { CAFFEINE_EQUIVALENTS } from '../../data/drinks';
import { formatPriceExact } from '../../domain/format';
import { caffeineThisMonth, coffeesThisMonth, favouriteDrink, streak } from '../../domain/stats';
import type { Addons, PlanTier, PlanType } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useNow, useUsuals } from '../../store/hooks';
import { configSummary, drinkMeta, drinkName } from '../../i18n/drinkText';
import type { Translator } from '../../i18n/useT';

export function CatalogSection({ tr }: { tr: Translator }) {
  const now = useNow();
  const usuals = useUsuals();
  const orders = useStore((s) => s.orders);
  const [plan, setPlan] = useState<{ type: PlanType; perDay: PlanTier }>({ type: 'milk', perDay: 3 });
  const [addons, setAddons] = useState<Addons>({ premium: true, adaptogenic: false, altMilk: true });
  const [pack, setPack] = useState<number>(30);
  const [health, setHealth] = useState(false);

  const byCoffees = [...LEADERBOARD].sort((a, b) => b.coffees - a.coffees);
  const byCaffeine = [...LEADERBOARD].sort((a, b) => b.coffees * b.avgMg - a.coffees * a.avgMg);
  const mg = caffeineThisMonth(orders, now);
  const fav = favouriteDrink(orders, now);
  const days = streak(orders, now);

  return (
    <>
      <Section id="usualcard" name="UsualCard" note="Body opens the order screen pre-filled; the button orders in one tap.">
        <State label="Your usuals — live">
          <div style={{ display: 'grid', gap: 10 }}>
            {usuals.map((u) => (
              <UsualCard
                key={`${u.config.drinkId}-${u.config.milk}-${u.config.bean}`}
                name={drinkName(u.config.drinkId, tr)}
                summary={configSummary(u.config, tr)}
                note={tr.tp('usual.count', u.count)}
                orderLabel={tr.t('usual.order', { time: tr.t('common.now') })}
                onOrder={() => undefined}
                onOpen={() => undefined}
              />
            ))}
          </div>
        </State>
        <State label="Popular at VŠE (new user) · ordering · disabled">
          <div style={{ display: 'grid', gap: 10 }}>
            <UsualCard name={drinkName(POPULAR_AT_VSE[0]!.drinkId, tr)} summary={configSummary(POPULAR_AT_VSE[0]!, tr)} note={tr.t('home.popular')} orderLabel={tr.t('usual.order', { time: '10:30' })} onOrder={() => undefined} onOpen={() => undefined} />
            <UsualCard name={drinkName('cappuccino', tr)} summary={configSummary({ drinkId: 'cappuccino', milk: 'cow', bean: 'standard' }, tr)} orderLabel={tr.t('usual.order', { time: tr.t('common.now') })} ordering orderingLabel={tr.t('common.loading')} onOrder={() => undefined} onOpen={() => undefined} />
            <UsualCard name={drinkName('americano', tr)} summary={configSummary({ drinkId: 'americano', milk: null, bean: 'standard' }, tr)} orderLabel={tr.t('usual.order', { time: tr.t('common.now') })} disabled onOrder={() => undefined} onOpen={() => undefined} />
          </div>
        </State>
      </Section>

      <Section id="drinkrow" name="DrinkRow" note="Menu row with the i button. A drink the plan doesn't cover says so, quietly.">
        <State label="Menu">
          <div>
            {DRINKS.map((d, i) => (
              <DrinkRow
                key={d.id}
                name={d.name[tr.lang]}
                meta={drinkMeta(d.id, tr)}
                typeLabel={tr.t(`drink.type.${d.type}`)}
                strength={d.strength}
                strengthLabel={tr.t('compare.strengthOf', { n: d.strength })}
                strengthWord={tr.t('compare.strength')}
                infoLabel={tr.t('common.info', { drink: d.name[tr.lang] })}
                note={i === 4 ? tr.t('payment.notCovered') : undefined}
                onOpen={() => undefined}
                onInfo={() => undefined}
              />
            ))}
          </div>
        </State>
      </Section>

      <Section id="drinkcompare" name="DrinkCompare" note="Typical values. The drink you're looking at is highlighted.">
        <State label="Current: Flat white">
          <DrinkCompare current="flatwhite" tr={tr} />
        </State>
      </Section>

      <Section id="plancard" name="PlanCard" note="Prices per week, units always visible.">
        <State label="Milk · Black — interactive">
          <div role="group" aria-label={tr.t('screen.plans')} style={{ display: 'grid', gap: 10 }}>
            {(['milk', 'black'] as const).map((type) =>
              ([3, 1] as const).map((perDay) => (
                <PlanCard
                  key={`${type}${perDay}`}
                  name={tr.t(`plan.${type}`)}
                  allowance={tr.t(perDay === 1 ? 'plan.tier1' : 'plan.tier3')}
                  covers={tr.t(type === 'milk' ? 'plan.milkDesc' : 'plan.blackDesc')}
                  price={PLAN_PRICES[type][perDay]}
                  unit={tr.t('common.perWeek')}
                  selected={plan.type === type && plan.perDay === perDay}
                  currentLabel={type === 'milk' && perDay === 3 ? tr.t('plan.current') : undefined}
                  onSelect={() => setPlan({ type, perDay })}
                />
              )),
            )}
          </div>
        </State>
      </Section>

      <Section id="addonrow" name="AddOnRow" note="Monthly toggles. Switching is instant in the prototype.">
        <State label="Interactive">
          <div>
            {ADDON_IDS.map((id) => (
              <AddOnRow
                key={id}
                name={tr.t(`addon.${id}`)}
                description={tr.t(`addon.${id}Desc`)}
                price={ADDON_PRICES[id]}
                unit={tr.t('common.perMonth')}
                checked={addons[id]}
                onChange={(v) => setAddons({ ...addons, [id]: v })}
              />
            ))}
          </div>
        </State>
      </Section>

      <Section id="packtile" name="PackTile" note="Prepaid credits. Any drink, no daily cap.">
        <State label="Interactive">
          <div role="group" aria-label={tr.t('payment.pack')} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {PACKS.map((p) => (
              <PackTile
                key={p.size}
                size={p.size}
                unitLabel={tr.t('pack.unit')}
                price={p.price}
                perCoffee={tr.t('pack.perCoffee', { price: formatPriceExact(p.price / p.size, tr.lang) })}
                selected={pack === p.size}
                onSelect={() => setPack(p.size)}
              />
            ))}
          </div>
        </State>
      </Section>

      <Section id="giftcode" name="GiftCode" note="Gift moments are Vanilla. Copy falls back when the Share sheet isn't available.">
        <State label="Ticket — just sent">
          <GiftCode
            code="SKQ-4H7P"
            drink={drinkName('cappuccino', tr)}
            status="pending"
            labels={{ copy: tr.t('common.copy'), copied: tr.t('common.copied'), share: tr.t('common.share'), valid: tr.t('gift.valid'), status: tr.tp('gift.pending', 1) }}
          />
        </State>
        <State label="Sent list — pending / redeemed / returned">
          <div>
            <GiftCode variant="row" code="SKQ-4H7P" drink={drinkName('cappuccino', tr)} status="pending" labels={{ copy: '', copied: '', share: '', valid: '', status: tr.tp('gift.pending', 1) }} />
            <GiftCode variant="row" code="SKQ-8RTM" drink={drinkName('flatwhite', tr)} status="redeemed" labels={{ copy: '', copied: '', share: '', valid: '', status: tr.t('gift.redeemedBy', { name: 'crema_kral' }) }} />
            <GiftCode variant="row" code="SKQ-N3YV" drink={drinkName('latte', tr)} status="returned" labels={{ copy: '', copied: '', share: '', valid: '', status: tr.t('gift.returned') }} />
          </div>
        </State>
      </Section>

      <Section id="boardrow" name="BoardRow" note="Nicknames only. Your row is Vanilla and opens your stats; pinned below when outside the top 10.">
        <State label="Coffees — top 3, your row pinned">
          <div style={{ display: 'grid', gap: 2 }}>
            {byCoffees.slice(0, 3).map((u, i) => (
              <BoardRow key={u.nickname} rank={i + 1} nickname={u.nickname} value={u.coffees} />
            ))}
            <BoardRow rank={12} nickname="frederika_k" value={coffeesThisMonth(orders, now)} isYou youLabel={tr.t('board.you')} onClick={() => undefined} />
          </div>
        </State>
        <State label="Caffeine">
          <div style={{ display: 'grid', gap: 2 }}>
            {byCaffeine.slice(0, 3).map((u, i) => (
              <BoardRow key={u.nickname} rank={i + 1} nickname={u.nickname} value={u.coffees * u.avgMg} unit="mg" />
            ))}
          </div>
        </State>
      </Section>

      <Section id="stattile" name="StatTile" note="Personal stats — live from the persona's history.">
        <State label="This month">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatTile icon={<IconCup />} label={tr.t('stat.coffees')} value={coffeesThisMonth(orders, now)} />
            <StatTile icon={<IconBolt />} label={tr.t('stat.caffeine')} value={mg} unit="mg" sub={tr.t('stat.equivalent', { n: Math.round(mg / CAFFEINE_EQUIVALENTS.redBullCan) })} />
            <StatTile icon={<IconHeart />} label={tr.t('stat.favourite')} value={fav ? drinkName(fav, tr) : '—'} textValue />
            <StatTile icon={<IconFlame />} label={tr.t('stat.streak')} value={days} sub={tr.tp('stat.streakUnit', days)} />
          </div>
        </State>
      </Section>

      <Section id="comingsoon" name="ComingSoonTile" note="Apple Health: visible, honest, and explains itself.">
        <Stage label="Tile and its sheet" height={460} expanded={health}>
          <ComingSoonTile title={tr.t('health.title')} badge={tr.t('health.soon')} description={tr.t('health.desc')} onOpen={() => setHealth(true)} />
          <BottomSheet
            open={health}
            onClose={() => setHealth(false)}
            title={tr.t('health.title')}
            subtitle={tr.t('health.soon')}
            closeLabel={tr.t('common.close')}
            footer={
              <Button block disabled>
                {tr.t('health.notify')}
              </Button>
            }
          >
            <p style={{ font: 'var(--sq-body)' }}>{tr.t('health.desc')}</p>
          </BottomSheet>
        </Stage>
      </Section>
    </>
  );
}
