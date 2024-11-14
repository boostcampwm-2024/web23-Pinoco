import React, { useRef, useEffect } from 'react';
import useMediaStream from '@/hooks/useMediaStream';

export default function VideoStream() {
  const { mediaStream, error } = useMediaStream();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  return <div>{error ? <p>{error}</p> : <video ref={videoRef} autoPlay />}</div>;
}
