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

    socket.on('update_ready', (data: IReadyUsers) => {
      setReadyUsers(data.readyUsers);
    });

    socket.on('error', (data: IGameErrorMessage) => {
      setError(data.errorMessage);
      setTimeout(() => setError(null), 3000);
    });

    socket.on('start_game_success', (data: IGameStart) => {
      console.log('확인 id', data.speakerId);
      setGameStartData(data);
      setCurrentSpeaker(data.speakerId);
      setIsPinoco(data.isPinoco);
    });

    socket.on('start_speaking', (data: ISpeakingStart) => {
      console.log('백엔드에서 speakerId 오나 확인', data.speakerId);
      setCurrentSpeaker(data.speakerId);
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.SPEAKING);
      }
    });

    socket.on('start_vote', () => {
      if (onPhaseChange) {
        onPhaseChange(GAME_PHASE.VOTING);
      }
    });

    return () => {
      socket.off('update_ready');
      socket.off('error');
      socket.off('start_game_success');
      socket.off('start_speaking');
      socket.off('start_vote');
    };
  }, [socket, setIsPinoco, onPhaseChange]);

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
      console.log('보내지는지 확인');
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
