import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/landingPage/index';
import LobbyPage from '@/pages/lobbyPage/index';
import GamePage from '@/pages/gamePage/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'lobby',
        element: <LobbyPage />,
      },
      {
        path: 'game/:gameId',
        element: <GamePage />,
      },
    ],
  },
]);
