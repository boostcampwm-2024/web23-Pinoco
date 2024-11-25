import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';

interface IVoteResult {
  voteResult: Record<string, number>;
  deadPerson: string;
}

export default function useVoteResult(
  remainingPlayers: number,
  setRemainingPlayers: (value: number) => void,
  onIsVotedChange?: (isVoted: boolean) => void,
) {
  const socket = useSocketStore((state) => state.socket);
  const [voteResult, setVoteResult] = useState<Record<string, number>>({});
  const [deadPerson, setDeadPerson] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_vote_result', (data: IVoteResult) => {
      if (onIsVotedChange) {
        onIsVotedChange(false);
      }
      setVoteResult(data.voteResult);
      setDeadPerson(data.deadPerson);

      if (data.deadPerson !== 'none' && data.deadPerson) {
        setRemainingPlayers(remainingPlayers - 1);
      }
    });

    return () => {
      socket.off('receive_vote_result');
    };
  }, [socket, remainingPlayers, setRemainingPlayers, onIsVotedChange]);

  return { voteResult, deadPerson };
}
