import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { GAME_PHASE, GamePhase } from '@/constants';

interface IVoteResult {
  voteResult: Record<string, number>;
  deadPerson: string;
}

export default function useVoteResult(
  setGamePhase: (phase: GamePhase) => void,
  remainingPlayers: number,
  isPinoco: boolean,
  setRemainingPlayers: (value: number) => void,
) {
  const socket = useSocketStore((state) => state.socket);
  const [voteResult, setVoteResult] = useState<Record<string, number>>({});
  const [deadPerson, setDeadPerson] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_vote_result', (data: IVoteResult) => {
      setVoteResult(data.voteResult);
      setDeadPerson(data.deadPerson);

      setTimeout(() => {
        if (data.deadPerson === 'none') {
          socket.emit('start_speaking');
          setGamePhase(GAME_PHASE.SPEAKING);
        } else if (data.deadPerson === 'pinoco') {
          if (isPinoco) {
            socket.emit('start_guessing');
          }
          setGamePhase(GAME_PHASE.GUESSING);
        } else {
          setRemainingPlayers((prev) => prev - 1);
          if (remainingPlayers <= 3) {
            socket.emit('start_ending');
            setGamePhase(GAME_PHASE.ENDING);
          } else {
            socket.emit('start_speaking');
            setGamePhase(GAME_PHASE.SPEAKING);
          }
        }
      }, 5000);
    });

    return () => {
      socket.off('receive_vote_result');
    };
  }, [socket, setGamePhase, remainingPlayers, isPinoco, setRemainingPlayers]);

  return {
    voteResult,
    deadPerson,
  };
}
