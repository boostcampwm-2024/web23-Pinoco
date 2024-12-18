import { useEffect } from 'react';
import { useSocketStore } from '@/store/socketStore';
import { GAME_PHASE, GamePhase } from '@/constants';

export default function useGuessing(isPinoco: boolean, setGamePhase: (phase: GamePhase) => void) {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on('start_guessing', () => {
      setGamePhase(GAME_PHASE.GUESSING);
    });

    return () => {
      socket.off('start_guessing');
    };
  }, [socket, setGamePhase]);

  const submitGuess = (guessingWord: string) => {
    if (!socket || !isPinoco) return;

    socket.emit('send_guessing', { guessingWord });
  };

  return {
    submitGuess,
  };
}
