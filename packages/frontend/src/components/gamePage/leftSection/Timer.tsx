import { useEffect, useState, useRef } from 'react';

interface ITimerProps {
  initialTime: number;
  onTimeEnd: () => void;
}

export default function Timer({ initialTime, onTimeEnd }: ITimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsedTime = (currentTime - startTimeRef.current) / 1000;
      const newTimeLeft = initialTime - elapsedTime;

      if (newTimeLeft <= 0) {
        setTimeLeft(0);
        setTimeout(onTimeEnd, 50);
        return;
      }

      setTimeLeft(newTimeLeft);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initialTime, onTimeEnd]);

  const progressPercentage = Math.max((timeLeft / initialTime) * 100, 0);

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold text-white-default">TIME</span>
      <div className="w-full h-8">
        <div className="w-full h-full overflow-hidden bg-gray-700 rounded-full">
          <div
            className={`h-full transform-gpu transition-transform duration-[50ms] ease-linear ${
              timeLeft < 10 ? 'bg-red-500' : 'bg-green-default'
            }`}
            style={{ transform: `translateX(${progressPercentage - 100}%)` }}
          />
        </div>
      </div>
    </div>
  );
}
