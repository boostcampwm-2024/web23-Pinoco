import { useState, useEffect } from 'react';

interface CountdownProps {
  initialCount?: number;
  onCountdownEnd: () => void;
}

export default function Countdown({ initialCount = 3, onCountdownEnd }: CountdownProps) {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    setCountdown(initialCount);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          onCountdownEnd();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [initialCount, onCountdownEnd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex items-center justify-center text-black bg-white rounded-full size-32 bg-opacity-70">
        <p className="text-6xl font-bold text-white-default-default">{countdown}</p>
      </div>
    </div>
  );
}
