import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useEffect } from 'react';

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
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
