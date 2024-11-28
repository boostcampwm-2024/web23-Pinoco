import { useState, useEffect } from 'react';
import { useRoomStore } from '@/states/store/roomStore';
import StartButton from './GameButtons/StartButton';
import ReadyButton from './GameButtons/ReadyButton';
import { GAME_PHASE, GamePhase } from '@/constants';
import Timer from './Timer';
import GuessInput from './GuessInput';
import { useGameSocket } from '@/hooks/useGameSocket';
import useGuessing from '@/hooks/useGuessing';
import useEnding from '@/hooks/useEnding';
import useVoteResult from '@/hooks/useVoteResult';
import { useAuthStore } from '@/states/store/authStore';
import Countdown from './Countdown';
import WordDisplay from './WordDisplay';
import Voting from './GamePhases/Voting';
import VoteResult from './GamePhases/VoteResult';
import EndingResult from './GamePhases/EndingResult';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';
import VideoStream from '@/components/gamePage/stream/VideoStream';
import { useLocalStreamStore } from '@/states/store/localStreamStore';

export default function MainDisplay() {
  const { userId } = useAuthStore();
  const { isHost, isPinoco, allUsers } = useRoomStore();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GAME_PHASE.WAITING);
  const [theme, setTheme] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
  const { gameStartData, currentSpeaker, endSpeaking, votePinoco } = useGameSocket(setGamePhase);
  const { endingResult } = useEnding(setGamePhase);
  const { submitGuess } = useGuessing(isPinoco, setGamePhase);
  const { voteResult, deadPerson } = useVoteResult(
    setIsVoteSubmitted,
    setGamePhase,
    setSelectedVote,
  );
  function getCurrentStream() {
    const localStream = useLocalStreamStore.getState().localStream;
    const remoteStreams = usePeerConnectionStore.getState().remoteStreams;
    if (currentSpeaker === userId) return localStream;
    const currentStream = remoteStreams.get(currentSpeaker || '');
    return currentStream;
  }

  useEffect(() => {
    if (gameStartData) {
      setGamePhase(GAME_PHASE.COUNTDOWN);
      setCurrentWord(gameStartData.word);
      setTheme(gameStartData.theme);
    }
  }, [gameStartData]);

  const handleCountdownEnd = () => {
    setGamePhase(GAME_PHASE.WORD_REVEAL);
    setTimeout(() => {
      setGamePhase(GAME_PHASE.SPEAKING);
    }, 3000);
  };

  const handleVote = () => {
    if (!isVoteSubmitted) {
      if (selectedVote === null) {
        votePinoco('');
      } else {
        votePinoco(selectedVote);
      }
      setIsVoteSubmitted(true);
    }
  };
  return (
    <div
      className={`relative flex flex-col flex-grow w-full p-4 mt-4 rounded-lg ${
        gamePhase === GAME_PHASE.ENDING ? 'bg-green-default' : 'bg-green-default/40'
      }`}
    >
      <WordDisplay
        gamePhase={gamePhase}
        currentWord={currentWord}
        theme={theme}
        isPinoco={isPinoco}
      />

      <div className="flex-grow">
        {gamePhase === GAME_PHASE.WAITING && (
          <div className="flex flex-col items-center justify-center h-full">
            {isHost ? <StartButton /> : <ReadyButton />}
          </div>
        )}

        {gamePhase === GAME_PHASE.COUNTDOWN && <Countdown onCountdownEnd={handleCountdownEnd} />}

        {gamePhase === GAME_PHASE.SPEAKING && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-4/6 p-4">
              <VideoStream
                stream={getCurrentStream() || null}
                userName={currentSpeaker}
                isLocal={true}
                height="h-full"
              />
            </div>
            <div className="absolute p-2 text-lg rounded-lg top-16 left-4 text-white-default bg-slate-950">
              📢 {currentSpeaker}
            </div>
          </div>
        )}

        {gamePhase === GAME_PHASE.VOTING && (
          <Voting
            userId={userId!}
            allUsers={allUsers}
            selectedVote={selectedVote}
            isVoteSubmitted={isVoteSubmitted}
            setSelectedVote={setSelectedVote}
            handleVote={handleVote}
          />
        )}

        {gamePhase === GAME_PHASE.VOTING_RESULT && (
          <VoteResult deadPerson={deadPerson ?? ''} voteResult={voteResult} isPinoco={isPinoco} />
        )}
        {gamePhase === GAME_PHASE.GUESSING && (
          <div className="flex flex-col items-center justify-center h-full">
            {isPinoco ? (
              <GuessInput onSubmitGuess={submitGuess} />
            ) : (
              <p className="text-xl text-center text-white-default">
                피노코가 제시어를 추측 중입니다 🤔
              </p>
            )}
          </div>
        )}

        {gamePhase === GAME_PHASE.ENDING && <EndingResult endingResult={endingResult} />}
      </div>

      {gamePhase === GAME_PHASE.SPEAKING && (
        <div className="w-full mt-auto">
          <Timer key={currentSpeaker} initialTime={30} onTimeEnd={() => endSpeaking(userId!)} />
        </div>
      )}

      {gamePhase === GAME_PHASE.VOTING && (
        <div className="w-full mt-auto">
          <Timer key="voting" initialTime={60} onTimeEnd={handleVote} />
        </div>
      )}
    </div>
  );
}
