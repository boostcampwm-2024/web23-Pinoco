import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRoomStore } from '@/store/roomStore';
import StartButton from './GameButtons/StartButton';
import ReadyButton from './GameButtons/ReadyButton';
import { GAME_PHASE, GamePhase } from '@/constants';
import Timer from './Timer';
import GuessInput from './GuessInput';
import { useGameSocket } from '@/hooks/useGameSocket';
import useGuessing from '@/hooks/useGuessing';
import useEnding from '@/hooks/useEnding';
import useVoteResult from '@/hooks/useVoteResult';
import { useAuthStore } from '@/store/authStore';
import Countdown from './Countdown';
import WordDisplay from './WordDisplay';
import Voting from './GamePhases/Voting';
import VoteResult from './GamePhases/VoteResult';
import EndingResult from './GamePhases/EndingResult';
import { usePeerConnectionStore } from '@/store/peerConnectionStore';
import VideoStream from '@/components/gamePage/stream/VideoStream';
import { useLocalStreamStore } from '@/store/localStreamStore';
import { useSpeakingControl } from '@/hooks/useSpeakingControl';

const MainDisplay = memo(function MainDisplay() {
  const { userId } = useAuthStore();
  const { isHost, isPinoco, allUsers } = useRoomStore();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GAME_PHASE.WAITING);
  const [theme, setTheme] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
  const { gameStartData, currentSpeaker, endSpeaking, votePinoco } = useGameSocket(setGamePhase);
  const { endSpeakingEarly } = useSpeakingControl(currentSpeaker, userId);

  const { endingResult } = useEnding(setGamePhase);
  const { submitGuess } = useGuessing(isPinoco, setGamePhase);
  const { voteResult, deadPerson, isDeadPersonPinoco } = useVoteResult(
    setIsVoteSubmitted,
    setGamePhase,
    setSelectedVote,
  );

  const handleCountdownEnd = useCallback(() => {
    setGamePhase(GAME_PHASE.WORD_REVEAL);
    const timer = setTimeout(() => {
      setGamePhase(GAME_PHASE.SPEAKING);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleVote = useCallback(() => {
    if (!isVoteSubmitted) {
      votePinoco(selectedVote ?? '');
      setIsVoteSubmitted(true);
    }
  }, [isVoteSubmitted, selectedVote, votePinoco]);

  useEffect(() => {
    if (gameStartData) {
      setGamePhase(GAME_PHASE.COUNTDOWN);
      setCurrentWord(gameStartData.word);
      setTheme(gameStartData.theme);
    }
  }, [gameStartData]);

  const currentStreamData = useMemo(() => {
    if (currentSpeaker === userId) {
      return useLocalStreamStore.getState().localStream;
    }
    return usePeerConnectionStore.getState().remoteStreams.get(currentSpeaker || '');
  }, [currentSpeaker, userId]);

  const renderGamePhaseContent = useMemo(() => {
    switch (gamePhase) {
      case GAME_PHASE.WAITING:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            {isHost ? <StartButton /> : <ReadyButton />}
          </div>
        );
      case GAME_PHASE.COUNTDOWN:
        return <Countdown onCountdownEnd={handleCountdownEnd} />;
      case GAME_PHASE.VOTING:
        return (
          <Voting
            userId={userId!}
            allUsers={allUsers}
            selectedVote={selectedVote}
            isVoteSubmitted={isVoteSubmitted}
            setSelectedVote={setSelectedVote}
            handleVote={handleVote}
          />
        );
      case GAME_PHASE.VOTING_RESULT:
        return (
          <VoteResult
            deadPerson={deadPerson ?? ''}
            voteResult={voteResult}
            isDeadPersonPinoco={isDeadPersonPinoco ?? null}
          />
        );
      case GAME_PHASE.GUESSING:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            {isPinoco ? (
              <GuessInput onSubmitGuess={submitGuess} />
            ) : (
              <p className="text-xl text-center text-white-default">
                피노코가 제시어를 추측 중입니다 🤔
              </p>
            )}
          </div>
        );
      case GAME_PHASE.ENDING:
        return <EndingResult endingResult={endingResult} />;
      default:
        return null;
    }
  }, [
    gamePhase,
    isHost,
    userId,
    allUsers,
    selectedVote,
    isVoteSubmitted,
    handleVote,
    handleCountdownEnd,
    endingResult,
    deadPerson,
    voteResult,
    isDeadPersonPinoco,
    isPinoco,
    submitGuess,
  ]);

  return (
    <div
      className={`relative flex-1 flex flex-col w-full p-4 mt-4 rounded-lg overflow-hidden ${
        gamePhase === GAME_PHASE.ENDING ? 'bg-green-default' : 'bg-green-default/40'
      }`}
    >
      {gamePhase === GAME_PHASE.SPEAKING && (
        <div className="absolute inset-0">
          <VideoStream
            stream={currentStreamData || null}
            userName={currentSpeaker}
            isLocal={true}
            height="h-full"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4">
          <div className="mb-2">
            <WordDisplay
              gamePhase={gamePhase}
              currentWord={currentWord}
              theme={theme}
              isPinoco={isPinoco}
            />
          </div>
          {gamePhase === GAME_PHASE.SPEAKING && (
            <div className="p-2 text-lg rounded-lg w-fit text-white-default bg-slate-950">
              📢 {currentSpeaker}
            </div>
          )}
        </div>

        <div className="flex-1">{renderGamePhaseContent}</div>

        <div className="relative mt-auto">
          {gamePhase === GAME_PHASE.SPEAKING && currentSpeaker === userId && (
            <div className="absolute bottom-12 right-4">
              <button
                className="px-6 py-2 rounded-lg bg-green-default text-white-default hover:bg-green-200 hover:text-black"
                onClick={endSpeakingEarly}
              >
                발언 종료
              </button>
            </div>
          )}

          {(gamePhase === GAME_PHASE.SPEAKING || gamePhase === GAME_PHASE.VOTING) && (
            <div className="w-full">
              <Timer
                key={gamePhase === GAME_PHASE.SPEAKING ? currentSpeaker : 'voting'}
                initialTime={gamePhase === GAME_PHASE.SPEAKING ? 15 : 30}
                onTimeEnd={
                  gamePhase === GAME_PHASE.SPEAKING ? () => endSpeaking(userId!) : handleVote
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MainDisplay;
