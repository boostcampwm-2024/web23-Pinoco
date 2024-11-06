import BackgroundImage from '@/components/layout/BackgroundImage';

export default function GamePage() {
  return (
    <div className="relative w-full h-screen">
      <BackgroundImage />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
      <div className="absolute z-10 text-white-weak">123</div>
    </div>
  );
}
