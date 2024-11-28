import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { GAME_PHASE, GamePhase } from '@/constants';
import { useRoomStore } from '@/states/store/roomStore';

interface IVoteResult {
  voteResult: Record<string, number>;
  deadPerson: string;
  isDeadPersonPinoco: boolean;
}

export default function useVoteResult(
  onIsVotedChange?: (isVoted: boolean) => void,
  onPhaseChange?: (phase: GamePhase) => void,
  setSelectedVote?: (vote: string | null) => void,
) {
  const socket = useSocketStore((state) => state.socket);
  const { removeUser } = useRoomStore();
  const [voteResult, setVoteResult] = useState<Record<string, number>>({});
  const [deadPerson, setDeadPerson] = useState<string | null>(null);
  const [isDeadPersonPinoco, setIsDeadPersonPinoco] = useState<boolean | null>(null); // 추가

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_vote_result', (data: IVoteResult) => {
      if (onIsVotedChange) {
        onIsVotedChange(false);
      }
      if (data.deadPerson !== '') {
        removeUser(data.deadPerson);
      }

      setVoteResult(data.voteResult);
      setDeadPerson(data.deadPerson);
      setIsDeadPersonPinoco(data.isDeadPersonPinoco); // 추가

      if (setSelectedVote) {
        setSelectedVote(null);
      }
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.VOTING_RESULT);
      }
    });

    return () => {
      socket.off('receive_vote_result');
    };
  }, [socket, onIsVotedChange, onPhaseChange, removeUser, setSelectedVote]);

  return { voteResult, deadPerson, isDeadPersonPinoco }; // 수정
}
