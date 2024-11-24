import BackgroundImage from '@/components/layout/BackgroundImage';
import LeftGameSection from '@/components/gamePage/leftSection/LeftGameSection';
import RightGameSection from '@/components/gamePage/rightSection/RightGameSection';
import Header from '@/components/layout/Header';
import { useSocketStore } from '@/states/store/socketStore';

export default function GamePage() {
  const { socket } = useSocketStore();
  console.log('gamePage', socket?.connected);
  return (
    <>
      <BackgroundImage gradientClass="bg-white/30" />
      <Header />
      <div className="relative flex w-full h-screen">
        <LeftGameSection />
        <RightGameSection />
      </div>
    </>
  );
}
