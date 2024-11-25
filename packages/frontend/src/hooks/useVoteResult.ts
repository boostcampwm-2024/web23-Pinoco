import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { GAME_PHASE, GamePhase } from '@/constants';
import { useRoomStore } from '@/states/store/roomStore';

interface IVoteResult {
  voteResult: Record<string, number>;
  deadPerson: string;
}

export default function useVoteResult(
  onIsVotedChange?: (isVoted: boolean) => void,
  onPhaseChange?: (phase: GamePhase) => void,
) {
  const socket = useSocketStore((state) => state.socket);
  const { removeUser } = useRoomStore();
  const [voteResult, setVoteResult] = useState<Record<string, number>>({});
  const [deadPerson, setDeadPerson] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_vote_result', (data: IVoteResult) => {
      if (onIsVotedChange) {
        onIsVotedChange(false);
      }
      if (data.deadPerson !== 'none') {
        removeUser(data.deadPerson);
      }
      setVoteResult(data.voteResult);
      setDeadPerson(data.deadPerson);

      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.VOTING_RESULT);
      }
    });

    return () => {
      socket.off('receive_vote_result');
    };
  }, [socket, onIsVotedChange, onPhaseChange, removeUser]);

  return { voteResult, deadPerson };
}
