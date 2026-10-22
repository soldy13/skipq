import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomeScreen } from '../features/home/HomeScreen';
import { MeScreen } from '../features/me/MeScreen';
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
          <Route path="menu" element={<WipScreen title="screen.menu" milestone={2} />} />
          <Route path="order/status/:orderId" element={<WipScreen title="screen.status" milestone={2} />} />
          <Route path="order/:drinkId" element={<WipScreen title="screen.order" milestone={2} />} />
          <Route path="plans" element={<WipScreen title="screen.plans" milestone={3} />} />
          <Route path="gift" element={<WipScreen title="screen.gift" milestone={4} />} />
          <Route path="board" element={<WipScreen title="screen.board" milestone={4} />} />
          <Route path="me" element={<MeScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
