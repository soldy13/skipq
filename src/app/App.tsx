import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomeScreen } from '../features/home/HomeScreen';
import { MeScreen } from '../features/me/MeScreen';
import { MenuScreen } from '../features/menu/MenuScreen';
import { OrderScreen } from '../features/order/OrderScreen';
import { StatusScreen } from '../features/order/StatusScreen';
import { PlansScreen } from '../features/plans/PlansScreen';
import { GiftScreen } from '../features/gift/GiftScreen';
import { GiftPickScreen } from '../features/gift/GiftPickScreen';
import { GiftSendScreen } from '../features/gift/GiftSendScreen';
import { GiftCodeScreen } from '../features/gift/GiftCodeScreen';
import { RedeemScreen } from '../features/gift/RedeemScreen';
import { BoardScreen } from '../features/board/BoardScreen';
import { WipScreen } from '../features/WipScreen';

const Styleguide = lazy(() => import('../features/styleguide/Styleguide'));

/** Hash router: works on any static host without rewrite rules. */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/styleguide"
          element={
            <Suspense fallback={null}>
              <Styleguide />
            </Suspense>
          }
        />
        <Route element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="welcome" element={<WipScreen title="screen.welcome" milestone={5} />} />
          <Route path="menu" element={<MenuScreen />} />
          <Route path="order/status/:orderId" element={<StatusScreen />} />
          <Route path="order/:drinkId" element={<OrderScreen />} />
          <Route path="plans" element={<PlansScreen />} />
          <Route path="gift" element={<GiftScreen />} />
          <Route path="gift/send" element={<GiftPickScreen />} />
          <Route path="gift/send/:drinkId" element={<GiftSendScreen />} />
          <Route path="gift/code/:code" element={<GiftCodeScreen />} />
          <Route path="gift/redeem/:code" element={<RedeemScreen />} />
          <Route path="board" element={<BoardScreen />} />
          <Route path="me" element={<MeScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
