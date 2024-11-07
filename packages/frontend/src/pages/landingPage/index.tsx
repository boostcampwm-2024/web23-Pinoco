import GuestLoginButton from '@/components/landingPage/GuestLoginButton';
import OAuthLoginButton from '@/components/landingPage/OAuthLoginButton';
import PinocoLogo from '@/assets/svgs/pinocoLogo.svg?react';

export default function LandingPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <section className="flex w-2/3 items-center justify-between gap-16">
        <div className="flex flex-col gap-16">
          <div className="text-strong flex flex-col gap-2 text-6xl font-bold">
            <p>실시간 화상 통화로</p>
            <p>진행하는 라이어 게임</p>
          </div>
          <div className="flex flex-col gap-6">
            <OAuthLoginButton />
            <GuestLoginButton />
          </div>
        </div>
        <div>
          <PinocoLogo alt="Pinoco Logo" />
        </div>
      </section>
    </main>
  );
}
