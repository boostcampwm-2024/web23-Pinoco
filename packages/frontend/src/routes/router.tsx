import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/landingPage/index';
import LobbyPage from '@/pages/lobbyPage/index';
import GamePage from '@/pages/gamePage/index';
import PrivateRoute from '@/components/layout/PrivateRoute';
import PublicRoute from '@/components/layout/PublicRoute';

export const router = createBrowserRouter([
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
