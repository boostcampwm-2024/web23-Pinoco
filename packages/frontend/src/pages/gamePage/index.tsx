import { useState } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import LeftGameSection from '@/components/gamePage/leftSection/LeftGameSection';
import RightGameSection from '@/components/gamePage/rightSection/RightGameSection';
import Header from '@/components/layout/Header';
import GameManual from '@/components/gamePage/GameManual';
import { useSocketStore } from '@/store/socketStore';
import { useRoomStore } from '@/store/roomStore';

export default function GamePage() {
  const { socket } = useSocketStore();
  console.log('gamePage', socket?.connected);
  const { allUsers } = useRoomStore();
  console.log('방 내에 모든 allUsers 목록', allUsers);

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
