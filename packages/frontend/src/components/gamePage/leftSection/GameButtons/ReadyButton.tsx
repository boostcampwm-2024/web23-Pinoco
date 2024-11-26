import { useState } from 'react';
import { useGameSocket } from '@/hooks/useGameSocket';
import Button from '@/components/common/Button';

export default function ReadyButton() {
  const [isReady, setIsReady] = useState(false);
  const { sendReady } = useGameSocket();

  const handleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    sendReady(newReadyState);
  };

  return (
    <Button
      buttonText={isReady ? '준비완료' : '준비하기'}
      className={`max-w-xs text-xl transition-all text-white-default ${
        isReady ? 'bg-green-default' : 'bg-black opacity-90'
      }`}
      onClick={handleReady}
    />
  );
}
