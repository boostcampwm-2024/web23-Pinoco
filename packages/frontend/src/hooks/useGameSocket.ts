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
}

interface ISpeakingStart {
  speakerId: string;
}

export const useGameSocket = (onPhaseChange?: (phase: GamePhase) => void) => {
  const socket = useSocketStore((state) => state.socket);
  const { setIsPinoco } = useRoomStore();
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameStartData, setGameStartData] = useState<IGameStart | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleStartSpeaking = (data: ISpeakingStart) => {
      console.log('백엔드에서 speakerId 오나 확인 [start_speaking]', data.speakerId);
      setCurrentSpeaker(data.speakerId);
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.SPEAKING);
      }
    };

    const handleStartGame = (data: IGameStart) => {
      console.log('초기 발언자 id [start_game_success]', data.speakerId);
      setGameStartData(data);
      setCurrentSpeaker(data.speakerId);
      setIsPinoco(data.isPinoco);
    };

    const handleStartVote = () => {
      console.log('투표 시작 이벤트 수신!');
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
  }, [socket, setIsPinoco, onPhaseChange, setCurrentSpeaker]);

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
