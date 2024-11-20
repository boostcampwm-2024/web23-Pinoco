import { useState } from 'react';
import { useRoomStore } from '@/states/store/roomStore';
import StartButton from './GameButtons/StartButton';
import ReadyButton from './GameButtons/ReadyButton';
import { GAME_PHASE, GamePhase } from '@/constants';
import Timer from './Timer';
import Button from '@/components/common/Button';
import { useGameButtonSocket } from '@/hooks/useGameButtonSocket';

export default function MainDisplay() {
  const { isHost } = useRoomStore();
  const { readyUsers } = useGameButtonSocket();
  const [gamePhase, setGamePhase] = useState<GamePhase>(GAME_PHASE.WAITING);
  const [countdown, setCountdown] = useState(3);
  const [currentWord, setCurrentWord] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);

  const handleSpeakerChange = () => {
    setTimeout(() => {
      setIsTimerActive(false);

      if (currentSpeaker < readyUsers.length - 1) {
        setCurrentSpeaker((prev) => prev + 1);
        setIsTimerActive(true);
      } else {
        setGamePhase(GAME_PHASE.VOTING);
        setCurrentSpeaker(0);
        setIsTimerActive(true);
      }
    }, 1000);
  };

  const handleVote = () => {
    if (selectedVote === null) return;

    setIsVoteSubmitted(true);

    setTimeout(() => {
      setIsTimerActive(false);

      setTimeout(() => {
        setGamePhase(GAME_PHASE.ENDING);
        setIsVoteSubmitted(false);
      }, 500);
    }, 1000);
  };

  const renderVotingUI = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
        <h2 className="text-2xl font-bold text-white">라이어를 지목해주세요!</h2>
        <div className="flex flex-col w-full max-w-md space-y-3">
          {readyUsers.map((userId) => (
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
            <p className="text-xl text-white">현재 발언자: {readyUsers[currentSpeaker]}</p>
            <p className="mt-2 text-lg text-white">제시어: {currentWord}</p>
          </div>
        )}

        {gamePhase === GAME_PHASE.VOTING && renderVotingUI()}

        {gamePhase === GAME_PHASE.ENDING && (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-white">투표 결과</h2>
            <p className="mt-4 text-xl text-white">{selectedVote}가 지목되었습니다!</p>
          </div>
        )}
      </div>

      {(gamePhase === GAME_PHASE.SPEAKING || gamePhase === GAME_PHASE.VOTING) && isTimerActive && (
        <div className="w-full mt-auto">
          <Timer
            key={`${gamePhase}-${currentSpeaker}`}
            initialTime={gamePhase === GAME_PHASE.SPEAKING ? 3 : 6}
            onTimeEnd={() => {
              if (gamePhase === GAME_PHASE.SPEAKING) {
                handleSpeakerChange();
              } else if (gamePhase === GAME_PHASE.VOTING) {
                handleVote();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
