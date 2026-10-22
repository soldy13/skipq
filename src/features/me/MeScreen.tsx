import { WipScreen } from '../WipScreen';
import { Segmented } from '../../components/Segmented';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n/useT';
import type { LangPref } from '../../domain/types';

/** Milestone 1: only the language override is live (F17); stats and history land in milestone 4. */
export function MeScreen() {
  const tr = useT();
  const language = useStore((s) => s.profile.language);
  const setLanguage = useStore((s) => s.setLanguage);
  return (
    <WipScreen title="screen.me" milestone={4}>
      <Segmented<LangPref>
        label={tr.t('demo.language')}
        value={language}
        onChange={setLanguage}
        options={[
          { value: 'auto', label: tr.t('lang.auto') },
          { value: 'en', label: tr.t('lang.en') },
          { value: 'cs', label: tr.t('lang.cs') },
        ]}
      />
    </WipScreen>
  );
}
