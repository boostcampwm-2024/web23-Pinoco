import { useEffect } from 'react';
import AppRouter from './routes/router';

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

  return <AppRouter />;
}

export default App;
