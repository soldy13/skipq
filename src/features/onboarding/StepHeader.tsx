import w from './Welcome.module.css';
import { IconButton } from '../../components/Button';
import { IconChevronLeft } from '../../components/icons';
import { useT } from '../../i18n/useT';

const STEPS = 2;

/** The wordmark (or Back on later steps) and a progress track: one segment per step, done and current ones in Coffee. */
export function StepHeader({ n, onBack }: { n: number; onBack?: () => void }) {
  const tr = useT();
  return (
    <div className={w.top}>
      {onBack ? (
        <IconButton label={tr.t('nav.back')} tone="filled" icon={<IconChevronLeft />} onClick={onBack} />
      ) : (
        <span className={w.wordmark}>SkipQ</span>
      )}
      <p className={w.steps}>
        <span className="sq-sr-only">{tr.t('welcome.steps', { n, total: STEPS })}</span>
        <span className={w.track} aria-hidden="true">
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={i < n ? `${w.segment} ${w.segmentOn}` : w.segment} />
          ))}
        </span>
      </p>
    </div>
  );
}
