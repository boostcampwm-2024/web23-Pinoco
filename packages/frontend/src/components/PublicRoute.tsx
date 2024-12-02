import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface IPublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: IPublicRouteProps) {
  const { userId } = useAuthStore();

  if (userId) {
    return <Navigate to="/lobby" replace />;
  }

  return <>{children}</>;
}
