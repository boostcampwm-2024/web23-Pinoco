interface IVoteResultPhaseProps {
  deadPerson: string;
  voteResult: Record<string, number>;
}

export default function VoteResult({ deadPerson, voteResult }: IVoteResultPhaseProps) {
  return (
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
}
