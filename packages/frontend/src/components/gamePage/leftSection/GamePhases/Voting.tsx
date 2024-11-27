import Button from '@/components/common/Button';

interface IVotingPhaseProps {
  userId: string;
  allUsers: Set<string>;
  selectedVote: string | null;
  isVoteSubmitted: boolean;
  setSelectedVote: (userId: string) => void;
  handleVote: () => void;
}

export default function Voting({
  userId,
  allUsers,
  selectedVote,
  isVoteSubmitted,
  setSelectedVote,
  handleVote,
}: IVotingPhaseProps) {
  if (!allUsers.has(userId)) {
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
}
