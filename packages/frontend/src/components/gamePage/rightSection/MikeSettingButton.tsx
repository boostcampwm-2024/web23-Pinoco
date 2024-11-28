import { useState } from 'react';
import MikeOn from '@/assets/images/MikeOn.svg?react';
import MikeOff from '@/assets/images/MikeOff.svg?react';

export default function MikeSettingButton() {
  const [isMikeOn, setIsMikeOn] = useState(false);
  function handleMike() {
    setIsMikeOn(!isMikeOn);
  }
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
