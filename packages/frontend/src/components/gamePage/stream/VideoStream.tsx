import { useRef, useEffect } from 'react';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import useMediaStream from '@/hooks/useMediaStream';

export default function VideoStream() {
  const { localStream } = useLocalStreamStore();
  const { error } = useMediaStream();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return <div>{error ? <p>{error}</p> : <video ref={videoRef} autoPlay />}</div>;
}
