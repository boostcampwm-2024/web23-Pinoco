import { useEffect, useState } from 'react';

interface ITimerProps {
  initialTime: number; // seconds
  onTimeEnd?: () => void;
}

export default function Timer({ initialTime, onTimeEnd }: ITimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeEnd?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeEnd]);

  const progressPercentage = (timeLeft / initialTime) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold text-white-default">TIME</span>
      <div className="w-full h-8">
        <div className="w-full h-full overflow-hidden bg-gray-700 rounded-full">
          <div
            className={`h-full transform-gpu transition-transform duration-1000 ease-linear ${
              timeLeft < 10 ? 'bg-red-500' : 'bg-green-default'
            }`}
            style={{ transform: `translateX(${progressPercentage - 100}%)` }}
          />
        </div>
      </div>
    </div>
  );
}
