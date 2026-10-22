import { useState } from 'react';
import p from './PlansScreen.module.css';
import { CheckoutSheet } from '../order/CheckoutSheet';
import { Button } from '../../components/Button';
import { RichText } from '../../components/RichText';
import { PackTile } from '../../components/PackTile';
import { PACKS, type Pack } from '../../data/pricing';
import { formatPriceExact } from '../../domain/format';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';

/** Brief F10: pick a pack, pay (simulated), and the credits show up as a payment option. */
export function PacksSection() {
  const tr = useT();
  const wallet = useStore((s) => s.wallet);
  const buyPack = useStore((s) => s.buyPack);
  const showToast = useUi((s) => s.showToast);
  const [size, setSize] = useState<Pack['size']>(30);
  const [paying, setPaying] = useState(false);
  const pack = PACKS.find((x) => x.size === size) ?? (PACKS[0] as Pack);
  const credits = wallet.packCredits + wallet.giftCredits;

  return (
    <section className={p.section} aria-labelledby="packs-title">
      <div className={p.head}>
        <h2 id="packs-title" className={p.heading}>
          {tr.t('plans.packs')}
        </h2>
        <p className={p.note}>{tr.t('plans.packsNote')}</p>
        {credits > 0 ? (
          <p className={p.credits}>
            <RichText text={tr.tp('payment.packLeft', credits, { n: '{n}' })} nodes={{ n: <span className="sq-mono">{credits}</span> }} />
          </p>
        ) : null}
      </div>
      <div role="group" aria-label={tr.t('plans.packs')} className={p.packs}>
        {PACKS.map((x) => (
          <PackTile
            key={x.size}
            size={x.size}
            unitLabel={tr.t('pack.unit')}
            price={x.price}
            perCoffee={tr.t('pack.perCoffee', { price: formatPriceExact(x.price / x.size, tr.lang) })}
            selected={size === x.size}
            onSelect={() => setSize(x.size)}
          />
        ))}
      </div>
      <Button block variant="secondary" onClick={() => setPaying(true)}>
        {tr.t('plans.buyPack', { n: pack.size, price: tr.price(pack.price) })}
      </Button>
      <CheckoutSheet
        open={paying}
        onClose={() => setPaying(false)}
        lines={[{ label: tr.t('checkout.pack'), value: tr.t('pack.title', { n: pack.size }) }]}
        amount={pack.price}
        onPaid={() => {
          buyPack(pack.size);
          setPaying(false);
          showToast({ message: tr.t('plans.packBought', { n: pack.size }) });
        }}
      />
    </section>
  );
}
