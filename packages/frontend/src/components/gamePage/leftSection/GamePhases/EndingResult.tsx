interface IEndingPhaseProps {
  endingResult: {
    isPinocoWin: boolean;
    pinoco: string;
    isGuessed: boolean;
    guessingWord: string | null;
  } | null;
}

export default function EndingResult({ endingResult }: IEndingPhaseProps) {
  if (!endingResult) return null;

  const { isPinocoWin, pinoco, isGuessed, guessingWord } = endingResult;

  const resultImage = isPinocoWin
    ? '/images/ending/pinocoWin.png'
    : '/images/ending/geppettoWin.png';
  const getEndingMessage = () => {
    if (guessingWord && isGuessed) {
      return (
        <>
          피노코가 제시어를 맞추며 위기에서 벗어났습니다! 제출된 제시어:{' '}
          <span className="font-extrabold">{guessingWord}</span>
        </>
      );
    }

    if (isPinocoWin) {
      return <>피노코가 자신의 정체를 숨기며 제페토를 속였습니다 😉</>;
    }

    return <>피노코가 제시어를 맞추지 못했습니다 🔨</>;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <img
        src={resultImage}
        alt={isPinocoWin ? '피노코 승리' : '제페토 승리'}
        className="w-[60%] max-h-[400px] object-contain"
      />

      <h2 className="text-3xl font-extrabold text-white-default">
        {isPinocoWin ? '피노코가 승리했습니다 🤥' : '제페토가 승리했습니다 🧓🏻'}
      </h2>

      <div className="text-2xl text-center text-white-default leading-relaxed">
        <p>
          피노코는 <span className="font-extrabold">{pinoco}</span> 였습니다!
        </p>
        <p>{getEndingMessage()}</p>
      </div>
    </div>
  );
}
