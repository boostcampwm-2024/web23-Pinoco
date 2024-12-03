import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
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
            <LandingPage />
          </PublicRoute>
        ),
      },
      {
        path: 'lobby',
        element: (
          <PrivateRoute>
            <LobbyPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'game/:gsid',
        element: (
          <PrivateRoute>
            <GamePage />
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

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
