import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PublicRoute from '@/components/PublicRoute';
import PrivateRoute from '@/components/PrivateRoute';

const LandingPage = lazy(() => import('@/pages/landingPage/index'));
const LobbyPage = lazy(() => import('@/pages/lobbyPage/index'));
const GamePage = lazy(() => import('@/pages/gamePage/index'));

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

function App() {
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('room-storage');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
