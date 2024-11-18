import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useSocketStore } from '@/states/store/socketStore';

const queryClient = new QueryClient();

function App() {
  const { disconnectSocket } = useSocketStore();

  useEffect(() => {
    const handleUnload = () => {
      disconnectSocket();
    };

    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
