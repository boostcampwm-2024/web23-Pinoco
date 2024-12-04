import LoadingSpinner from '@/components/common/LoadingSpinner';
import Layout from '@/components/layout/Layout';
import { lazy } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import PublicRoute from '@/components/PublicRoute';
import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const LandingPage = lazy(() => import('@/pages/landingPage/index'));
const LobbyPage = lazy(() => import('@/pages/lobbyPage/index'));
const GamePage = lazy(() => import('@/pages/gamePage/index'));

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <PublicRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <LandingPage />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: 'lobby',
          element: (
            <PrivateRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <LobbyPage />
              </Suspense>
            </PrivateRoute>
          ),
        },
        {
          path: 'game/:gsid',
          element: (
            <PrivateRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <GamePage />
              </Suspense>
            </PrivateRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
