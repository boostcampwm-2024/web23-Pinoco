import { useState } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import LeftGameSection from '@/components/gamePage/leftSection/LeftGameSection';
import RightGameSection from '@/components/gamePage/rightSection/RightGameSection';
import GameManual from '@/components/gamePage/GameManual';

export default function GamePage() {
  const [isGameManualVisible, setIsGameManualVisible] = useState(true);

  const handleCloseManual = () => {
    setIsGameManualVisible(false);
  };

  return (
    <>
      <BackgroundImage gradientClass="bg-white/30" />
      <div className="relative flex w-full h-screen">
        <LeftGameSection />
        <RightGameSection />
      </div>
      {isGameManualVisible && <GameManual onClose={handleCloseManual} />}
    </>
  );
}
