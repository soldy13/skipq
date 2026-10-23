import { normalizeNickname, type NicknameError } from '../../domain/nickname';
import type { Translator } from '../../i18n/useT';

/** Each nickname problem in words, with the fix ("No spaces in a nickname. Use _ instead."). */
export function nicknameErrorText(error: NicknameError, value: string, tr: Translator): string {
  switch (error.kind) {
    case 'short':
      return tr.t('nick.error.short');
    case 'long':
      return tr.t('nick.error.long');
    case 'char':
      return /\s/.test(error.char) ? tr.t('nick.error.space') : tr.t('nick.error.char', { char: error.char });
    case 'taken':
      return tr.t('nick.error.taken', { name: normalizeNickname(value) });
  }
}
