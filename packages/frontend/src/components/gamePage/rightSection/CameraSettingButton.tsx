import { useState } from 'react';
import CameraOn from '@/assets/images/CameraOn.svg?react';
import CameraOff from '@/assets/images/CameraOff.svg?react';

export default function CameraSettingButton() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  function handleCamera() {
    setIsCameraOn(!isCameraOn);
  }
  return (
    <button
      className="p-4 w-[120px] bg-transparent rounded-lg flex flex-col items-center justify-center gap-2"
      onClick={handleCamera}
    >
      {isCameraOn ? (
        <CameraOn className="text-white-default" />
      ) : (
        <CameraOff className="text-white-default" />
      )}
      <p className="text-white-default text-lg">
        카메라 {isCameraOn ? <span className="text-red-600">ON</span> : <span>OFF</span>}
      </p>
    </button>
  );
}
