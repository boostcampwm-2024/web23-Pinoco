import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface IPrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: IPrivateRouteProps) {
  const { userId } = useAuthStore();

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
