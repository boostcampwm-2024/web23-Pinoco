import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { GAME_PHASE, GamePhase } from '@/constants';

interface IEndingResult {
  isPinocoWin: boolean;
  pinoco: string;
  isGuessed: boolean;
  guessingWord: string;
}

export default function useEnding(setGamePhase: (phase: GamePhase) => void) {
  const socket = useSocketStore((state) => state.socket);
  const [endingResult, setEndingResult] = useState<IEndingResult | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleStartEnding = (data: IEndingResult) => {
      setEndingResult(data);
      setGamePhase(GAME_PHASE.ENDING);
    };

    socket.on('start_ending', handleStartEnding);

    return () => {
      socket.off('start_ending', handleStartEnding);
    };
  }, [socket, setGamePhase]);

  useEffect(() => {
    if (endingResult) {
      const timeout = setTimeout(() => {
        setGamePhase(GAME_PHASE.WAITING);
        setEndingResult(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [endingResult, setGamePhase]);

  return {
    endingResult,
  };
}
