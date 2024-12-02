import { useEffect } from 'react';
import { useSocketStore } from '@/states/store/socketStore';

export const useSpeakingControl = (currentSpeaker: string | null, userId: string | null) => {
  const socket = useSocketStore((state) => state.socket);

  const endSpeakingEarly = () => {
    if (!socket || currentSpeaker !== userId) return;
    socket.emit('end_speaking');
  };
  return { endSpeakingEarly };
};
