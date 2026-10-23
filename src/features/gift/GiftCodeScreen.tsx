import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Screen.module.css';
import g from './Gift.module.css';
import { giftStatusLabel } from './giftText';
import { ScreenHeader } from '../ScreenHeader';
import { Button } from '../../components/Button';
import { GiftCode } from '../../components/GiftCode';
import { DOT_SEP } from '../../domain/format';
import { giftStatus } from '../../domain/gifts';
import { useStore } from '../../store/useStore';
import { useNow } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { configSummary, drinkName } from '../../i18n/drinkText';

/** The code to pass on (brief F11): copy or share it. Also reachable from "Your gifts". */
export function GiftCodeScreen() {
  const { code } = useParams();
  const tr = useT();
  const navigate = useNavigate();
  const now = useNow();
  const gift = useStore((s) => s.gifts.find((x) => x.code === code));

  if (!gift) {
    return (
      <div className={styles.screen}>
        <ScreenHeader fallback="/gift" />
        <h1 className={styles.title}>{tr.t('gift.notFound')}</h1>
      </div>
    );
  }

  const status = giftStatus(gift, now);
  // The pill counts the days; the line names the date. The 5-day policy itself is told where the gift is sent.
  const valid = [gift.toName ? tr.t('gift.forLine', { name: gift.toName }) : null, status === 'pending' ? tr.t('gift.expiresOn', { date: tr.date(gift.expiresAt) }) : null]
    .filter((x): x is string => x !== null)
    .join(DOT_SEP);
  return (
    <div className={styles.screen}>
      <ScreenHeader fallback="/gift" />
      <header className={styles.header}>
        <h1 className={styles.title}>{tr.t('gift.sentTitle')}</h1>
        <p className={g.lead}>{tr.t('gift.sentBody')}</p>
      </header>
      <div className={g.ticketWrap}>
        <GiftCode
          code={gift.code}
          drink={`${drinkName(gift.config.drinkId, tr)}${DOT_SEP}${configSummary(gift.config, tr)}`}
          status={status}
          shareText={tr.t('gift.shareText')}
          labels={{
            copy: tr.t('common.copy'),
            copied: tr.t('common.copied'),
            share: tr.t('common.share'),
            valid: valid || undefined,
            status: giftStatusLabel(gift, now, tr),
          }}
        />
        <Button block variant="secondary" onClick={() => navigate('/gift')}>
          {tr.t('gift.done')}
        </Button>
      </div>
    </div>
  );
}
