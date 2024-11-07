import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import Layout from '@/components/layout/Layout';
import GamePage from '@/pages/gamePage/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'game',
        element: <GamePage />,
      },
    ],
  },
]);
