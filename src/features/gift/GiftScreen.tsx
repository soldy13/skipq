import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import g from './Gift.module.css';
import { giftStatusLabel, redeemErrorText } from './giftText';
import { Button } from '../../components/Button';
import { CodeInput } from '../../components/CodeInput';
import { GiftCode } from '../../components/GiftCode';
import { Segmented } from '../../components/Segmented';
import { DOT_SEP } from '../../domain/format';
import { checkRedeem } from '../../domain/giving';
import { giftStatus } from '../../domain/gifts';
import { isCompleteCode } from '../../domain/gifts';
import { useStore, worldOf } from '../../store/useStore';
import { useNow } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { drinkName } from '../../i18n/drinkText';

type Tab = 'send' | 'redeem';

/** Gift tab (brief §3): Send — start a gift and see the ones you sent; Redeem — type a code. */
export function GiftScreen() {
  const tr = useT();
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('tab') === 'redeem' ? 'redeem' : 'send';

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{tr.t('screen.gift')}</h1>
      </header>
      <Segmented<Tab>
        label={tr.t('screen.gift')}
        value={tab}
        onChange={(v) => setParams(v === 'redeem' ? { tab: 'redeem' } : {}, { replace: true })}
        options={[
          { value: 'send', label: tr.t('gift.tabSend') },
          { value: 'redeem', label: tr.t('gift.tabRedeem') },
        ]}
      />
      {tab === 'send' ? <SendTab /> : <RedeemTab />}
    </div>
  );
}

function SendTab() {
  const tr = useT();
  const navigate = useNavigate();
  const now = useNow();
  const nickname = useStore((s) => s.profile.nickname);
  const gifts = useStore((s) => s.gifts);
  const mine = gifts.filter((x) => x.fromNickname === nickname).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <>
      <section className={g.intro}>
        <p className={g.lead}>{tr.t('gift.intro')}</p>
        <p className={g.note}>{tr.t('gift.valid')}</p>
        <Button block onClick={() => navigate('/gift/send')}>
          {tr.t('gift.choose')}
        </Button>
      </section>
      <section className={g.list} aria-labelledby="sent-title">
        <h2 id="sent-title" className={styles.sectionTitle}>
          {tr.t('gift.yours')}
        </h2>
        {mine.length === 0 ? (
          <p className={g.note}>{tr.t('gift.none')}</p>
        ) : (
          <ul>
            {mine.map((x) => (
              <li key={x.code}>
                <Link to={`/gift/code/${x.code}`} className={g.rowLink}>
                  <GiftCode
                    variant="row"
                    code={x.code}
                    drink={x.toName ? `${drinkName(x.config.drinkId, tr)}${DOT_SEP}${tr.t('gift.forLine', { name: x.toName })}` : drinkName(x.config.drinkId, tr)}
                    status={giftStatus(x, now)}
                    labels={{ copy: '', copied: '', share: '', valid: '', status: giftStatusLabel(x, now, tr) }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function RedeemTab() {
  const tr = useT();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();

  function submit() {
    const s = useStore.getState();
    const result = checkRedeem(worldOf(s), code, s.clock.now);
    if (result.ok) navigate(`/gift/redeem/${code}`);
    else setError(redeemErrorText(result.error, tr));
  }

  return (
    <section className={g.intro}>
      <p className={g.lead}>{tr.t('gift.redeemIntro')}</p>
      <CodeInput
        value={code}
        onChange={(v) => {
          setCode(v);
          setError(undefined);
        }}
        label={tr.t('code.label')}
        hint={tr.t('code.hint')}
        error={error}
        onSubmit={submit}
      />
      <Button block disabled={!isCompleteCode(code)} onClick={submit}>
        {tr.t('gift.continue')}
      </Button>
    </section>
  );
}
