import GuestLoginButton from '@/components/landingPage/GuestLoginButton';
import OAuthLoginButton from '@/components/landingPage/OAuthLoginButton';
import PinocoLogo from '@/assets/svgs/pinocoLogo.svg?react';

export default function LandingPage() {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <section className="flex justify-between w-2/3 items-center">
        <div className="flex flex-col gap-16">
          <div className="text-strong  text-6xl font-bold flex flex-col gap-2">
            <p>실시간 화상 통화로</p>
            <p>진행하는 라이어 게임</p>
          </div>
          <div className="flex flex-col gap-6">
            <OAuthLoginButton />
            <GuestLoginButton />
          </div>
        </div>
        <div>
          <PinocoLogo alt="Pinoco Logo" className="w-[480px] h-[140px]" />
        </div>
      </section>
    </main>
  );
}
