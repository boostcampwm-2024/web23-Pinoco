import { useState, useEffect } from 'react';
import CameraOn from '@/assets/images/CameraOn.svg?react';
import CameraOff from '@/assets/images/CameraOff.svg?react';
import { useLocalStreamStore } from '@/states/store/localStreamStore';

export default function CameraSettingButton() {
  const { localStream } = useLocalStreamStore();
  const [isCameraOn, setIsCameraOn] = useState(false);
  function handleCamera() {
    setIsCameraOn(!isCameraOn);
    const camera = localStream?.getVideoTracks()[0];
    if (camera) camera.enabled = !isCameraOn;
  }
  useEffect(() => {
    const initSetting = !!localStream?.getVideoTracks()[0];
    setIsCameraOn(initSetting);
  }, [localStream]);
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
