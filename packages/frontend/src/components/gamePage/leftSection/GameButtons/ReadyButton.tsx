import { useState } from 'react';
import Button from '@/components/common/Button';

interface ReadyButtonProps {
  onReady: (isReady: boolean) => void;
}

export default function ReadyButton({ onReady }: ReadyButtonProps) {
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    onReady(newReadyState);
  };

  return (
    <Button
      buttonText={isReady ? '준비완료' : '준비하기'}
      className={`max-w-xs text-xl transition-all text-white-default ${isReady ? 'bg-green-default' : 'bg-black opacity-90'}`}
      onClick={handleReady}
    />
  );
}
