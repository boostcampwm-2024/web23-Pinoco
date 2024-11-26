import { useState, useEffect } from 'react';
import { useRoomStore } from '@/states/store/roomStore';
import StartButton from './GameButtons/StartButton';
import ReadyButton from './GameButtons/ReadyButton';
import { GAME_PHASE, GamePhase } from '@/constants';
import Timer from './Timer';
import Button from '@/components/common/Button';
import GuessInput from './GuessInput';
import { useGameSocket } from '@/hooks/useGameSocket';
import useGuessing from '@/hooks/useGuessing';
import useEnding from '@/hooks/useEnding';
import useVoteResult from '@/hooks/useVoteResult';
import { useAuthStore } from '@/states/store/authStore';

export default function MainDisplay() {
  const { userId } = useAuthStore();
  const { isHost, isPinoco, allUsers } = useRoomStore();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GAME_PHASE.WAITING);
  const [countdown, setCountdown] = useState(3);
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
    if (!isVoteSubmitted) {
      if (selectedVote === null) {
        votePinoco('');
      } else {
        votePinoco(selectedVote);
      }
      setIsVoteSubmitted(true);
    }
  };

  const renderVotingUI = () => {
    if (!allUsers.has(userId!)) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <h2 className="text-2xl font-bold text-white-default">투표가 진행중입니다</h2>
          <p className="text-lg text-white-default">다른 플레이어들의 투표를 기다려주세요...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
        <h2 className="text-2xl font-bold text-white-default">피노코를 지목해주세요!</h2>
        <div className="flex flex-col w-full max-w-md space-y-3">
          {Array.from(allUsers).map((userId: string) => (
            <button
              key={userId}
              onClick={() => !isVoteSubmitted && setSelectedVote(userId)}
              disabled={isVoteSubmitted}
              className={`w-full p-4 text-lg font-medium transition-colors rounded-lg ${
                selectedVote === userId
                  ? 'bg-green-default text-white-default'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } ${isVoteSubmitted && 'opacity-60 cursor-not-allowed'}`}
            >
              {userId}
            </button>
          ))}
        </div>
        {isVoteSubmitted ? (
          <div className="flex flex-col items-center space-y-2">
            <p className="text-lg font-medium text-white-default">
              {selectedVote}님을 피노코로 지목하였습니다
            </p>
            <p className="text-sm text-white-default">잠시 후 결과가 공개됩니다</p>
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

  const renderVoteResultUI = () => (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <h2 className="text-2xl font-bold text-white-default">투표 결과</h2>
      {deadPerson === '' ? (
        <p className="text-xl text-white-default">동점입니다. 아무도 제거되지 않았습니다.</p>
      ) : (
        <p className="text-xl text-white-default">{deadPerson}님이 제거되었습니다.</p>
      )}
      <ul className="mt-4 space-y-2">
        {Object.entries(voteResult).map(([userId, votes]) => (
          <li key={userId} className="text-lg text-white-default">
            {userId}: {votes}표
          </li>
        ))}
      </ul>
    </div>
  );

  const renderEndingUI = () => {
    if (!endingResult) return;

    const { isPinocoWin, pinoco, isGuessed, guessingWord } = endingResult;
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold text-white-default">
          {isPinocoWin ? '피노코가 승리했습니다 🤥' : '제페토가 승리했습니다 🔨'}
        </h2>
        {isGuessed && (
          <p className="text-xl text-white-default">
            피노코 {pinoco}가 제출한 제시어: {guessingWord}
          </p>
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
              <p className="text-6xl font-bold text-white-default-default">{countdown}</p>
            </div>
          </div>
        )}

        {gamePhase === GAME_PHASE.WORD_REVEAL && (
          <div className="flex items-center justify-center h-full">
            <p className="text-3xl font-bold text-white-default">제시어: {currentWord}</p>
          </div>
        )}

        {gamePhase === GAME_PHASE.SPEAKING && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl text-white-default">현재 발언자: {currentSpeaker}</p>
            <p className="mt-2 text-lg text-white-default">제시어: {currentWord}</p>
          </div>
        )}

        {gamePhase === GAME_PHASE.VOTING && renderVotingUI()}

        {gamePhase === GAME_PHASE.VOTING_RESULT && renderVoteResultUI()}

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

        {gamePhase === GAME_PHASE.ENDING && renderEndingUI()}
      </div>
      {gamePhase === GAME_PHASE.SPEAKING && (
        <div className="w-full mt-auto">
          <Timer key={currentSpeaker} initialTime={5} onTimeEnd={() => endSpeaking(userId!)} />
        </div>
      )}

      {gamePhase === GAME_PHASE.VOTING && (
        <div className="w-full mt-auto">
          <Timer key="voting" initialTime={10} onTimeEnd={handleVote} />
        </div>
      )}
    </div>
  );
}
