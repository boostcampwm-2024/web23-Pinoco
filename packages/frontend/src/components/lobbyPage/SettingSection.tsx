import MikeOn from '@/assets/images/MikeOn.svg?react';
import MikeOff from '@/assets/images/MikeOff.svg?react';
import CameraOn from '@/assets/images/CameraOn.svg?react';
import CameraOff from '@/assets/images/CameraOff.svg?react';

export default function SettingSection() {
  return (
    <>
      <div className="flex items-center gap-4 mr-8">
        <div className="flex flex-col items-center p-2 rounded-md bg-grayscale-white opacity-40">
          <span className="cursor-pointer">
            <MikeOn className="text-black" />
          </span>
          <span className="text-black">마이크</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-md bg-grayscale-white opacity-40">
          <span className="cursor-pointer">
            <CameraOn className="text-black" />
          </span>
          <span className="text-black">마이크</span>
        </div>
      </div>
    </>
  );
}
