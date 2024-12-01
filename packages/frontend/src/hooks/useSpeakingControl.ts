import { useEffect } from 'react';
import { useSocketStore } from '@/states/store/socketStore';

export const useSpeakingControl = (currentSpeaker: string | null, userId: string | null) => {
  const socket = useSocketStore((state) => state.socket);

  const endSpeakingEarly = () => {
    if (!socket || currentSpeaker !== userId) return;
    socket.emit('end_speaking');
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('speaking_ended', () => {
      console.log('발언 종료 처리됨');
    });

    return () => {
      socket.off('speaking_ended');
    };
  }, [socket]);

  return { endSpeakingEarly };
};
