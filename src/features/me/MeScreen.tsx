import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Screen.module.css';
import m from './MeScreen.module.css';
import { MeStats } from './MeStats';
import { MeHistory } from './MeHistory';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { ComingSoonTile } from '../../components/ComingSoonTile';
import { Segmented } from '../../components/Segmented';
import { IconChevronRight } from '../../components/icons';
import type { LangPref } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n/useT';
import { planSummary } from '../plans/planText';

/** Me tab (brief §3): personal stats, Apple Health (coming soon), plan, order history, language, nickname. */
export function MeScreen() {
  const tr = useT();
  const profile = useStore((s) => s.profile);
  const plan = useStore((s) => s.plan);
  const credits = useStore((s) => s.wallet.packCredits + s.wallet.giftCredits);
  const setLanguage = useStore((s) => s.setLanguage);
  const [health, setHealth] = useState(false);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{profile.displayName ?? profile.nickname ?? tr.t('screen.me')}</h1>
        {profile.nickname ? <p className={m.nick}>{profile.nickname}</p> : null}
      </header>

      <MeStats />

      <ComingSoonTile title={tr.t('health.title')} badge={tr.t('health.soon')} description={tr.t('health.desc')} onOpen={() => setHealth(true)} />

      <section className={m.section} aria-labelledby="plan-title">
        <h2 id="plan-title" className={m.heading}>
          {tr.t('me.plan')}
        </h2>
        <p className={m.body}>{planSummary(plan, credits, tr)}</p>
        <Link to="/plans" className="sq-link">
          {tr.t('me.managePlan')}
          <IconChevronRight size={18} />
        </Link>
      </section>

      <MeHistory />

      <section className={m.section} aria-labelledby="lang-title">
        <h2 id="lang-title" className={m.heading}>
          {tr.t('me.language')}
        </h2>
        <Segmented<LangPref>
          label={tr.t('me.language')}
          value={profile.language}
          onChange={setLanguage}
          options={[
            { value: 'auto', label: tr.t('lang.auto') },
            { value: 'en', label: tr.t('lang.en') },
            { value: 'cs', label: tr.t('lang.cs') },
          ]}
        />
      </section>

      {profile.nickname ? (
        <section className={m.section} aria-labelledby="nick-title">
          <h2 id="nick-title" className={m.heading}>
            {tr.t('me.nickname')}
          </h2>
          <p className={m.body}>{profile.nickname}</p>
          <p className={m.note}>{tr.t('me.nicknameNote')}</p>
        </section>
      ) : null}

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
        <div className={m.healthBody}>
          <p className={m.body}>{tr.t('health.desc')}</p>
          <h3 className={m.subheading}>{tr.t('health.what')}</h3>
          <ul className={m.bullets}>
            <li>{tr.t('health.date')}</li>
            <li>{tr.t('health.caffeine')}</li>
          </ul>
          <p className={m.note}>{tr.t('health.never')}</p>
        </div>
      </BottomSheet>
    </div>
  );
}
