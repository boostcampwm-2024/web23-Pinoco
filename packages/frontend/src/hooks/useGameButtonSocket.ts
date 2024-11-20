import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { useRoomStore } from '@/states/store/roomStore';

interface IReadyUsers {
  readyUsers: string[];
}

interface IGameErrorMessage {
  errorMessage: string;
}

interface IGameStart {
  isPinoco: boolean;
  word: string;
}

export const useGameButtonSocket = () => {
  const socket = useSocketStore((state) => state.socket);
  const { setIsPinoco } = useRoomStore();
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameStartData, setGameStartData] = useState<IGameStart | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('update_ready', (data: IReadyUsers) => {
      setReadyUsers(data.readyUsers);
    });

    socket.on('error', (data: IGameErrorMessage) => {
      setError(data.errorMessage);
      setTimeout(() => setError(null), 3000);
    });

    socket.on('start_game_success', (data: IGameStart) => {
      setGameStartData(data);
      setIsPinoco(data.isPinoco);
    });

    return () => {
      socket.off('update_ready');
      socket.off('error');
      socket.off('start_game_success');
    };
  }, [socket, setIsPinoco]);

  const sendReady = (isReady: boolean) => {
    if (!socket) return;
    socket.emit('send_ready', { isReady });
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit('start_game');
  };

  return { readyUsers, sendReady, startGame, error, gameStartData };
};
