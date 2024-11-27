interface IVoteResultPhaseProps {
  deadPerson: string | null;
  voteResult: Record<string, number>;
  isPinoco: boolean;
}

export default function VoteResult({ deadPerson, voteResult, isPinoco }: IVoteResultPhaseProps) {
  const maxVotes = Math.max(...Object.values(voteResult));
  const maxVotedUsers = Object.entries(voteResult)
    .filter(([_, votes]) => votes === maxVotes)
    .map(([userId]) => userId);
  const totalVotes = Object.values(voteResult).reduce((sum, votes) => sum + votes, 0);

  const isTie = maxVotedUsers.length > 1;
  const isNoElimination = isTie || maxVotedUsers.includes('');

  const getRoleText = (userId: string) => {
    return userId === '' ? '' : isPinoco && userId === deadPerson ? '피노코' : '제페토';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <h2 className="text-2xl font-bold text-white-default">투표 결과</h2>
      {deadPerson ? (
        <>
          <p className="text-xl text-white-default">
            {deadPerson}님이 제거되었습니다. {deadPerson}님은 {getRoleText(deadPerson)}였습니다 !
          </p>
        </>
      ) : isNoElimination ? (
        <p className="text-xl text-white-default">
          {isTie
            ? '동점입니다. 아무도 제거되지 않았습니다.'
            : '무효표가 가장 많아 아무도 제거되지 않았습니다.'}
        </p>
      ) : (
        <p className="text-xl text-white-default">에러가 발생했습니다.</p>
      )}
      <ul className="mt-4 space-y-2">
        {Object.entries(voteResult).map(([userId, votes]) =>
          userId === '' ? (
            <li key="invalid" className="text-lg text-white-default">
              무효표: {votes}표
            </li>
          ) : (
            <li key={userId} className="text-lg text-white-default">
              {userId}: {votes}표
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
