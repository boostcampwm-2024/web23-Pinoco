import { useSocketStore } from '@/states/store/socketStore';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { socket } = useSocketStore();
  if (!socket?.connected) {
    return <Navigate to="/" replace />;
  }
  return children;
}
