import { useGameSocket } from '@/hooks/useGameSocket';

export const useReadyStatus = () => {
  const { readyUsers } = useGameSocket();

  const isUserReady = (userId: string) => readyUsers.includes(userId);

  return { isUserReady };
};
