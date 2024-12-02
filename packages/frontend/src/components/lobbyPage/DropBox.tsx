import { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from '@/assets/images/DropBoxArrowDown.svg?react';
import ArrowUpIcon from '@/assets/images/DropBoxArrowUp.svg?react';
import { changeMediaDevice } from '@/utils/videoStreamUtils';
import { useLocalStreamStore } from '@/store/localStreamStore';

interface IDropBoxProps {
  title: string;
  type: 'video' | 'audio';
}

function DropBox({ title, type }: IDropBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropBoxRef = useRef<HTMLDivElement>(null);
  const videoDevices = useLocalStreamStore((state) => state.videoDevices);
  const audioInputDevices = useLocalStreamStore((state) => state.audioInputDevices);
  const currentVideoDevice = useLocalStreamStore((state) => state.currentVideoDevice);
  const currentAudioDevice = useLocalStreamStore((state) => state.currentAudioDevice);
  const targetMedia = type === 'video' ? currentVideoDevice : currentAudioDevice;
  const targetMediaList = type === 'video' ? videoDevices : audioInputDevices;
  const targetMediaLabel = targetMedia?.label || targetMediaList?.[0]?.label;

  function handleClick() {
    if (!targetMediaList?.length) return;
    setIsOpen(!isOpen);
  }

  function handleDeviceChange(device: MediaDeviceInfo) {
    if (device.kind === 'videoinput') {
      changeMediaDevice({ videoDeviceId: device.deviceId, audioDeviceId: '' });
    } else {
      changeMediaDevice({ videoDeviceId: '', audioDeviceId: device.deviceId });
    }
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropBoxRef.current && !dropBoxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={dropBoxRef}
      className="flex flex-col gap-2 cursor-pointer select-none"
      onClick={handleClick}
    >
      <span className="text-sm font-semibold">{title}</span>
      <div className="flex items-center gap-2 relative">
        <div className="w-full border border-black rounded-lg px-4 py-2 flex items-center justify-between">
          {targetMediaList?.length ? (
            targetMediaLabel
          ) : (
            <span className="text-gray-500">장치가 없습니다</span>
          )}
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
        {isOpen && (
          <div className="border border-black rounded-lg p-2 absolute left-0 right-0 top-full mt-1 bg-white z-10">
            {targetMediaList?.map((device) => {
              if (device.deviceId.includes('communications')) return null;
              return (
                <div
                  key={device.deviceId}
                  className="p-2 hover:bg-gray-200 cursor-pointer rounded-lg flex items-center gap-2"
                  onClick={() => handleDeviceChange(device)}
                >
                  {targetMediaLabel === device.label && <span className="text-green-500">✅</span>}
                  {device.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DropBox;
