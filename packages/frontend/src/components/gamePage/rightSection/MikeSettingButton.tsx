import { useState, useEffect } from 'react';
import MikeOn from '@/assets/images/MikeOn.svg?react';
import MikeOff from '@/assets/images/MikeOff.svg?react';
import { useLocalStreamStore } from '@/states/store/localStreamStore';

export default function MikeSettingButton() {
  const { localStream } = useLocalStreamStore();
  const [isMikeOn, setIsMikeOn] = useState(false);
  function handleMike() {
    setIsMikeOn(!isMikeOn);
    const mike = localStream?.getAudioTracks()[0];
    if (mike) mike.enabled = !isMikeOn;
  }
  useEffect(() => {
    const initSetting = !!localStream?.getAudioTracks()[0];
    setIsMikeOn(initSetting);
  }, [localStream]);
  return (
    <button
      className="w-[120px] p-4 bg-transparent rounded-lg flex flex-col items-center justify-center gap-2"
      onClick={handleMike}
    >
      {isMikeOn ? (
        <MikeOn className="text-white-default" />
      ) : (
        <MikeOff className="text-white-default" />
      )}
      <p className="text-white-default text-lg">
        마이크 {isMikeOn ? <span className="text-red-600">ON</span> : <span>OFF</span>}
      </p>
    </button>
  );
}
