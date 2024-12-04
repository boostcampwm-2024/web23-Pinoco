import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketStore } from '@/store/socketStore';
import { useRoomStore } from '@/store/roomStore';
import { GAME_PHASE, GamePhase } from '@/constants';

interface IReadyUsers {
  readyUsers: string[];
}

interface IGameErrorMessage {
  errorMessage: string;
}

interface IGameStart {
  isPinoco: boolean;
  theme: string;
  word: string;
  speakerId: string;
  allUserIds: string[];
}

interface ISpeakingStart {
  speakerId: string;
}

export const useGameSocket = (onPhaseChange?: (phase: GamePhase) => void) => {
  const socket = useSocketStore((state) => state.socket);
  const { setIsPinoco, setAllUsers, setReadyUsers } = useRoomStore();
  const [error, setError] = useState<string | null>(null);
  const [gameStartData, setGameStartData] = useState<IGameStart | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

  const handleUpdateReady = useCallback(
    (data: IReadyUsers) => {
      setReadyUsers(data.readyUsers);
    },
    [setReadyUsers],
  );

  const handleStartSpeaking = useCallback(
    (data: ISpeakingStart) => {
      setCurrentSpeaker(data.speakerId);
      onPhaseChange?.(GAME_PHASE.SPEAKING);
    },
    [onPhaseChange],
  );

  const handleStartGame = useCallback(
    (data: IGameStart) => {
      setAllUsers(data.allUserIds);
      setGameStartData(data);
      setCurrentSpeaker(data.speakerId);
      setIsPinoco(data.isPinoco);
      setReadyUsers([]);
    },
    [setAllUsers, setIsPinoco, setReadyUsers],
  );

  const handleStartVote = useCallback(() => {
    onPhaseChange?.(GAME_PHASE.VOTING);
  }, [onPhaseChange]);

  useEffect(() => {
    if (!socket) return;

    socket.on('update_ready', handleUpdateReady);
    socket.on('start_game_success', handleStartGame);
    socket.on('start_speaking', handleStartSpeaking);
    socket.on('start_vote', handleStartVote);
    socket.on('error', (data: IGameErrorMessage) => {
      setError(data.errorMessage);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('update_ready', handleUpdateReady);
      socket.off('start_game_success', handleStartGame);
      socket.off('start_speaking', handleStartSpeaking);
      socket.off('start_vote', handleStartVote);
      socket.off('error');
    };
  }, [socket, handleUpdateReady, handleStartGame, handleStartSpeaking, handleStartVote]);

  const sendReady = useCallback(
    (isReady: boolean) => {
      socket?.emit('send_ready', { isReady });
    },
    [socket],
  );

  const startGame = useCallback(() => {
    socket?.emit('start_game');
  }, [socket]);

  const endSpeaking = useCallback(
    (userId: string) => {
      if (userId === currentSpeaker) {
        socket?.emit('end_speaking');
      }
    },
    [socket, currentSpeaker],
  );

  const votePinoco = useCallback(
    (voteUserId: string) => {
      socket?.emit('vote_pinoco', { voteUserId });
    },
    [socket],
  );

  return {
    sendReady,
    startGame,
    error,
    gameStartData,
    currentSpeaker,
    endSpeaking,
    votePinoco,
  };
};
