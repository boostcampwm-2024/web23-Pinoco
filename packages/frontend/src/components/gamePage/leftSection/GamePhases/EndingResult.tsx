interface IEndingPhaseProps {
  endingResult: {
    isPinocoWin: boolean;
    pinoco: string;
    isGuessed: boolean;
    guessingWord: string;
  } | null;
}

export default function EndingResult({ endingResult }: IEndingPhaseProps) {
  if (!endingResult) return null;

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
}
