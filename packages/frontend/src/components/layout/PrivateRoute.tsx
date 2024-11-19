import { useSocketStore } from '@/states/store/socketStore';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { socket } = useSocketStore();
  if (!socket) {
    return <Navigate to="/" replace />;
  }
  return children;
}
