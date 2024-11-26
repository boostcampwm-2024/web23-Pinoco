import { useRef, useEffect } from 'react';

interface VideoFeedProps {
  userName: string | null;
  stream: MediaStream | null;
  isLocal?: boolean;
}

export default function VideoFeed({ userName, stream, isLocal }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      console.log('[Client][🎥] VideoFeed stream: ', {
        stream,
        tracks: stream?.getTracks(),
        active: stream?.active,
        audioTracks: stream?.getAudioTracks().length,
        videoTracks: stream?.getVideoTracks().length,
      });
    }
  }, [stream]);

  return (
    <div className="aspect-video relative w-full overflow-hidden bg-gray-700 rounded-lg min-h-32">
      <video
        ref={videoRef}
        muted={isLocal}
        autoPlay
        playsInline
        className="object-cover w-full h-full"
      />
      <div className="absolute bottom-0 left-0 p-2 text-sm bg-black bg-opacity-50 text-white-default">
        {userName}
      </div>
    </div>
  );
}
