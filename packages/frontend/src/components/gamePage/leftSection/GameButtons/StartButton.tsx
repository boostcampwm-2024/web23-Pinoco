import { useGameButtonSocket } from '@/hooks/useGameButtonSocket';
import Button from '@/components/common/Button';

export default function StartButton() {
  const { startGame, error } = useGameButtonSocket();

  return (
    <div className="flex flex-col items-center w-full space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        buttonText="시작하기"
        className={`max-w-xs text-xl transition-all text-white-default bg-green-default`}
        onClick={startGame}
      />
    </div>
  );
}
