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

/** Real seconds a ready banner stays up before it tucks itself away. */
const BANNER_MS = 8000;

/** The ready banner (brief §4.5) and the one toast slot, rendered inside the phone frame. */
export function Notifications() {
  const tr = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = useStore((s) => s.inbox[0]);
  const order = useStore((s) => (notice ? s.orders.find((o) => o.id === notice.orderId) : undefined));
  const now = useStore((s) => s.clock.now);
  // A time jump can carry a queued order past its hold; never announce a coffee that's no longer waiting.
  const stillReady = order !== undefined && orderStatus(order, now, RAJSKA.brewMinutes) === 'ready';
  const dismissNotice = useStore((s) => s.dismissNotice);
  const undoOrder = useStore((s) => s.undoOrder);
  const toast = useUi((s) => s.toast);
  const clearToast = useUi((s) => s.clearToast);
  const showToast = useUi((s) => s.showToast);

  const statusPath = order ? `/order/status/${order.id}` : null;
  const alreadyThere = statusPath !== null && location.pathname === statusPath;

  useEffect(() => {
    if (!notice) return;
    if (alreadyThere || !stillReady) {
      dismissNotice(notice.id);
      return;
    }
    const timer = window.setTimeout(() => dismissNotice(notice.id), BANNER_MS);
    return () => window.clearTimeout(timer);
  }, [notice, stillReady, alreadyThere, dismissNotice]);

  return (
    <>
      {notice && order && stillReady && !alreadyThere ? (
        <PushBanner
          key={notice.id}
          from={tr.t('push.from')}
          message={tr.t('push.ready', { drink: drinkNameInline(order.config.drinkId, tr), n: order.boxId, time: tr.time(order.holdUntil) })}
          dismissLabel={tr.t('common.close')}
          onDismiss={() => dismissNotice(notice.id)}
          onOpen={() => {
            dismissNotice(notice.id);
            navigate(`/order/status/${order.id}`);
          }}
        />
      ) : null}
      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          box={toast.box}
          actionLabel={toast.undoOrderId ? tr.t('common.undo') : undefined}
          onAction={
            toast.undoOrderId
              ? () => {
                  undoOrder(toast.undoOrderId as string);
                  showToast({ message: tr.t('toast.undone') });
                }
              : undefined
          }
          duration={toast.undoOrderId ? 5000 : 3000}
          onDone={() => clearToast(toast.id)}
        />
      ) : null}
    </>
  );
}
