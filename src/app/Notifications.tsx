import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PushBanner } from '../components/PushBanner';
import { Toast } from '../components/Toast';
import { useStore } from '../store/useStore';
import { useUi } from '../store/useUi';
import { useT } from '../i18n/useT';
import { drinkNameInline } from '../i18n/drinkText';
import { orderStatus } from '../domain/orders';
import { RAJSKA } from '../data/machines';

/** Real seconds a banner stays up before it tucks itself away. */
const BANNER_MS = 8000;

/** The banner (a coffee is ready, a gift came back) and the one toast slot, rendered inside the phone frame. */
export function Notifications() {
  const tr = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = useStore((s) => s.inbox[0]);
  const order = useStore((s) => (notice?.kind === 'ready' ? s.orders.find((o) => o.id === notice.orderId) : undefined));
  const now = useStore((s) => s.clock.now);
  const dismissNotice = useStore((s) => s.dismissNotice);
  const toast = useUi((s) => s.toast);
  const clearToast = useUi((s) => s.clearToast);

  // A time jump can carry a queued order past its hold; never announce a coffee that's no longer waiting.
  const stillReady = order !== undefined && orderStatus(order, now, RAJSKA.brewMinutes) === 'ready';
  const target = notice?.kind === 'giftReturned' ? '/gift' : order ? `/order/status/${order.id}` : null;
  const alreadyThere = notice?.kind === 'ready' && target !== null && location.pathname === target;
  const show = notice !== undefined && (notice.kind === 'giftReturned' || (stillReady && !alreadyThere));

  useEffect(() => {
    if (!notice) return;
    if (!show) {
      dismissNotice(notice.id);
      return;
    }
    const timer = window.setTimeout(() => dismissNotice(notice.id), BANNER_MS);
    return () => window.clearTimeout(timer);
  }, [notice, show, dismissNotice]);

  function message(): string {
    if (notice?.kind === 'giftReturned') {
      return notice.toName ? tr.t('push.giftBack', { name: notice.toName }) : tr.t('push.giftBackCode', { code: notice.code });
    }
    if (order) return tr.t('push.ready', { drink: drinkNameInline(order.config.drinkId, tr), n: order.boxId, time: tr.time(order.holdUntil) });
    return '';
  }

  return (
    <>
      {notice && show ? (
        <PushBanner
          key={notice.id}
          from={tr.t('push.from')}
          message={message()}
          dismissLabel={tr.t('common.close')}
          onDismiss={() => dismissNotice(notice.id)}
          onOpen={() => {
            dismissNotice(notice.id);
            if (target) navigate(target);
          }}
        />
      ) : null}
      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          box={toast.box}
          actionLabel={toast.action?.label}
          onAction={toast.action?.run}
          duration={toast.action ? 5000 : 3000}
          onDone={() => clearToast(toast.id)}
        />
      ) : null}
    </>
  );
}
