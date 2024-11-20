import { useSocketStore } from '@/states/store/socketStore';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { socket } = useSocketStore();
  if (socket?.connected) {
    return <Navigate to="/lobby" replace />;
  }
  return children;
}
