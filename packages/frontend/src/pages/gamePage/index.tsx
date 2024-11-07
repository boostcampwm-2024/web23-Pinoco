import BackgroundImage from '@/components/layout/BackgroundImage';
import LeftGameSection from '@/components/gamePage/leftSection/LeftGameSection';
import RightGameSection from '@/components/gamePage/rightSection/RightGameSection';

export default function GamePage() {
  return (
    <>
      <BackgroundImage gradientClass="bg-white/30" />
      <div className="relative flex w-full h-screen">
        <LeftGameSection />
        <RightGameSection />
      </div>
    </>
  );
}
