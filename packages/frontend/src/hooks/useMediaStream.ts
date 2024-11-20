import { useEffect, useState } from 'react';
import { useLocalStreamStore } from '@/states/store/localStreamStore';

interface IMediaStreamState {
  error: string | null;
}

export default function useMediaStream() {
  const { localStream, setLocalStream } = useLocalStreamStore();
  const [state, setState] = useState<IMediaStreamState>({ error: null });

  useEffect(() => {
    async function getMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        setLocalStream(stream);
      } catch (err) {
        setState({ error: '사용자의 카메라와 마이크에 접근하지 못했습니다.' });
      }
    }

    getMediaStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
        setLocalStream(null);
      }
    };
  });

  return state;
}
