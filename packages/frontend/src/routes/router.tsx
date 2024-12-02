import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/landingPage/index';
import LobbyPage from '@/pages/lobbyPage/index';
import GamePage from '@/pages/gamePage/index';
import PublicRoute from '@/components/PublicRoute';
import PrivateRoute from '@/components/PrivateRoute';

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
