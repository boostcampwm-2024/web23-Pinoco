import { useEffect, useState } from 'react';
import { useSocketStore } from '@/states/store/socketStore';
import { useRoomStore } from '@/states/store/roomStore';
import { GAME_PHASE, GamePhase } from '@/constants';

interface IReadyUsers {
  readyUsers: string[];
}

interface IGameErrorMessage {
  errorMessage: string;
}

interface IGameStart {
  isPinoco: boolean;
  word: string;
  speakerId: string;
  allUserIds: string[];
}

interface ISpeakingStart {
  speakerId: string;
}

export const useGameSocket = (onPhaseChange?: (phase: GamePhase) => void) => {
  const socket = useSocketStore((state) => state.socket);
  const { setIsPinoco, setAllUsers } = useRoomStore();
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameStartData, setGameStartData] = useState<IGameStart | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleStartSpeaking = (data: ISpeakingStart) => {
      setCurrentSpeaker(data.speakerId);
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.SPEAKING);
      }
    };

    const handleStartGame = (data: IGameStart) => {
      console.log('start_game_success시 서버로 부터 받는 데이터', data);
      setAllUsers(data.allUserIds);
      setGameStartData(data);
      setCurrentSpeaker(data.speakerId);
      setIsPinoco(data.isPinoco);
    };

    const handleStartVote = () => {
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.VOTING);
      }
    };

    socket.on('update_ready', (data: IReadyUsers) => {
      setReadyUsers(data.readyUsers);
    });

    socket.on('error', (data: IGameErrorMessage) => {
      setError(data.errorMessage);
      setTimeout(() => setError(null), 3000);
    });

    socket.on('start_game_success', handleStartGame);
    socket.on('start_speaking', handleStartSpeaking);
    socket.on('start_vote', handleStartVote);

    return () => {
      socket.off('update_ready');
      socket.off('error');
      socket.off('start_game_success', handleStartGame);
      socket.off('start_speaking', handleStartSpeaking);
      socket.off('start_vote', handleStartVote);
    };
  }, [socket, setIsPinoco, onPhaseChange, setCurrentSpeaker, setAllUsers]);

  const sendReady = (isReady: boolean) => {
    if (!socket) return;
    socket.emit('send_ready', { isReady });
  };

  const startGame = () => {
    if (!socket) return;
    socket.emit('start_game');
  };

  const endSpeaking = (userId: string) => {
    if (!socket) return;
    if (userId === currentSpeaker) {
      console.log('endSpeaking 호출');
      socket.emit('end_speaking');
    }
  };

  const votePinoco = (voteUserId: string) => {
    if (!socket) return;
    socket.emit('vote_pinoco', { voteUserId });
  };

  return {
    readyUsers,
    sendReady,
    startGame,
    error,
    gameStartData,
    currentSpeaker,
    endSpeaking,
    votePinoco,
  };
};
