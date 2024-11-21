import { useState, useEffect } from 'react';
import { useRoomStore } from '@/states/store/roomStore';
import StartButton from './GameButtons/StartButton';
import ReadyButton from './GameButtons/ReadyButton';
import { GAME_PHASE, GamePhase } from '@/constants';
import Timer from './Timer';
import Button from '@/components/common/Button';
import GuessInput from './GuessInput';
import useGuessing from '@/hooks/useGuessing';
import { useGameSocket } from '@/hooks/useGameSocket';

interface IPlayer {
  id: number;
  name: string;
  isReady: boolean;
}

export default function MainDisplay() {
  const { isHost, isPinoco } = useRoomStore();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GAME_PHASE.WAITING);
  const { readyUsers, gameStartData, currentSpeaker, endSpeaking, votePinoco } =
    useGameSocket(setGamePhase);

  const [countdown, setCountdown] = useState(3);
  const [currentWord, setCurrentWord] = useState('');
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);

  const { submitGuess } = useGuessing(isPinoco, setGamePhase);

  // 게임 시작 시 카운트다운 및 단어 공개
  useEffect(() => {
    if (gameStartData) {
      setGamePhase(GAME_PHASE.COUNTDOWN);
      setCurrentWord(gameStartData.word);
      setCountdown(3);

      const countdownInterval = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(countdownInterval);
            setGamePhase(GAME_PHASE.WORD_REVEAL);

            setTimeout(() => {
              setGamePhase(GAME_PHASE.SPEAKING);
            }, 3000);

            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [gameStartData]);

  const handleVote = () => {
    if (selectedVote === null) return;

    votePinoco(selectedVote);
    setIsVoteSubmitted(true);

    setTimeout(() => {
      setIsTimerActive(false);
    }, 1000);
  };

  const renderVotingUI = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
        <h2 className="text-2xl font-bold text-white">라이어를 지목해주세요!</h2>
        <div className="flex flex-col w-full max-w-md space-y-3">
          {readyUsers.map((userId: string) => (
            <button
              key={userId}
              onClick={() => !isVoteSubmitted && setSelectedVote(userId)}
              disabled={isVoteSubmitted}
              className={`w-full p-4 text-lg font-medium transition-colors rounded-lg
                ${
                  selectedVote === userId
                    ? 'bg-green-default text-white-default'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }
                ${isVoteSubmitted && 'opacity-60 cursor-not-allowed'}
              `}
            >
              {userId}
            </button>
          ))}
        </div>
        {isVoteSubmitted ? (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-medium text-white">
              {selectedVote}님을 라이어로 지목하였습니다
            </p>
            <p className="text-sm text-white">잠시 후 결과가 공개됩니다</p>
          </div>
        ) : (
          <Button
            buttonText="투표하기"
            className={`max-w-xs ${
              selectedVote === null ? 'bg-gray-300 cursor-not-allowed' : 'bg-white'
            }`}
            onClick={handleVote}
            disabled={selectedVote === null}
          />
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col flex-grow w-full p-4 mt-4 rounded-lg bg-green-default/40">
      <div className="flex-grow">
        {gamePhase === GAME_PHASE.WAITING && (
          <div className="flex flex-col items-center justify-center h-full">
            {isHost ? <StartButton /> : <ReadyButton />}
          </div>
        )}

        {gamePhase === GAME_PHASE.COUNTDOWN && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex items-center justify-center bg-black rounded-full size-32 bg-opacity-70">
              <p className="text-6xl font-bold text-white-default">{countdown}</p>
            </div>
          </div>
        )}

        {gamePhase === GAME_PHASE.WORD_REVEAL && (
          <div className="flex items-center justify-center h-full">
            <p className="text-3xl font-bold text-white">제시어: {currentWord}</p>
          </div>
        )}

        {gamePhase === GAME_PHASE.SPEAKING && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl text-white">현재 발언자: {currentSpeaker}</p>
            <p className="mt-2 text-lg text-white">제시어: {currentWord}</p>
          </div>
        )}

        {gamePhase === GAME_PHASE.VOTING && renderVotingUI()}

        {gamePhase === GAME_PHASE.GUESSING && (
          <div className="flex flex-col items-center justify-center h-full">
            {isPinoco ? (
              <GuessInput onSubmitGuess={submitGuess} />
            ) : (
              <p className="text-center text-xl text-white">피노코가 제시어를 추측 중입니다 🤔</p>
            )}
          </div>
        )}
      </div>

      {gamePhase === GAME_PHASE.SPEAKING && isTimerActive && (
        <div className="w-full mt-auto">
          <Timer key={currentSpeaker} initialTime={30} onTimeEnd={endSpeaking} />
        </div>
      )}

      {gamePhase === GAME_PHASE.VOTING && isTimerActive && (
        <div className="w-full mt-auto">
          <Timer key="voting" initialTime={60} onTimeEnd={handleVote} />
        </div>
      )}
    </div>
  );
}
