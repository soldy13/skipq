import { Chip, ChipGroup } from '../../components/Chip';
import { BEANS, MILKS } from '../../data/drinks';
import { isOptionLocked, type PaymentChoice } from '../../domain/ordering';
import type { Addons, Bean, Milk } from '../../domain/types';
import type { Translator } from '../../i18n/useT';
import { addonFor } from './orderText';
import type { AddonId } from '../../domain/types';

interface OptionChipsProps {
  tr: Translator;
  payment: PaymentChoice;
  addons: Addons;
  /** null for black drinks: no milk row. */
  milk: Milk | null;
  bean: Bean;
  onMilk: (m: Milk) => void;
  onBean: (b: Bean) => void;
  /** A locked chip opens its add-on instead of selecting. */
  onLocked: (addon: AddonId) => void;
}

/** Milk and bean choices. Locked options show "Add-on" and stay tappable (brief §4.1). */
export function OptionChips({ tr, payment, addons, milk, bean, onMilk, onBean, onLocked }: OptionChipsProps) {
  return (
    <>
      {milk !== null ? (
        <ChipGroup label={tr.t('milk.label')}>
          {MILKS.map((m) => {
            const locked = isOptionLocked({ kind: 'milk', value: m }, payment, addons);
            return (
              <Chip
                key={m}
                selected={!locked && milk === m}
                locked={locked}
                badge={locked ? tr.t('chip.addon') : undefined}
                onClick={() => (locked ? onLocked(addonFor({ kind: 'milk', value: m })) : onMilk(m))}
              >
                {tr.t(`milk.${m}`)}
              </Chip>
            );
          })}
        </ChipGroup>
      ) : null}
      <ChipGroup label={tr.t('bean.label')}>
        {BEANS.map((b) => {
          const locked = isOptionLocked({ kind: 'bean', value: b }, payment, addons);
          return (
            <Chip
              key={b}
              selected={!locked && bean === b}
              locked={locked}
              badge={locked ? tr.t('chip.addon') : undefined}
              onClick={() => (locked ? onLocked(addonFor({ kind: 'bean', value: b })) : onBean(b))}
            >
              {tr.t(`bean.${b}`)}
            </Chip>
          );
        })}
      </ChipGroup>
    </>
  );
}
