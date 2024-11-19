import Button from '@/components/common/Button';

interface StartButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

export default function StartButton({ onStart, disabled }: StartButtonProps) {
  return (
    <Button
      buttonText="시작하기"
      className={`max-w-xs text-xl transition-all text-white-default ${disabled ? 'bg-black opacity-90 cursor-not-allowed' : 'bg-green-default'}`}
      onClick={onStart}
      disabled={disabled}
    />
  );
}
