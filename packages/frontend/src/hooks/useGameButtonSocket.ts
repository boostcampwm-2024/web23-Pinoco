import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';

interface IReadyUsers {
  readyUsers: string[];
}

interface IGameErrorMessage {
  errorMessage: string;
}

export const useGameButtonSocket = () => {
  const socket = useSocketStore((state) => state.socket);
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('update_ready', (data: IReadyUsers) => {
      setReadyUsers(data.readyUsers);
    });

    socket.on('error', (data: IGameErrorMessage) => {
      setError(data.errorMessage);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('update_ready');
      socket.off('error');
    };
  }, [socket]);

  const sendReady = (isReady: boolean) => {
    if (!socket) return;
    socket.emit('send_ready', { isReady });
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit('start_game');
  };

  return { readyUsers, sendReady, startGame, error };
};
