import GuestLoginButton from '@/components/landingPage/GuestLoginButton';
import OAuthLoginButton from '@/components/landingPage/OAuthLoginButton';
import BackgroundImage from '@/components/layout/BackgroundImage';
import MainLogo from '@/assets/images/MainLogo.svg?react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      <BackgroundImage gradientClass="bg-gradient-to-t from-black/90" />
      <div className="relative flex items-center justify-center w-full h-screen gap-28 text-white-default">
        <div className="flex flex-col flex-shrink-0 gap-4">
          <span className="font-semibold text-7xl">실시간 화상 통화로</span>
          <span className="mb-24 font-semibold text-7xl">
            진행하는 라이어 게임
          </span>
          <GuestLoginButton />
          <OAuthLoginButton />
        </div>
        <div>
          <MainLogo />
        </div>
      </div>
    </>
  );
}
