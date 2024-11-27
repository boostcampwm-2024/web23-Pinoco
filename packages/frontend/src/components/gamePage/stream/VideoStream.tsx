import { useRef, useEffect } from 'react';

interface VideoStreamProps {
  userName: string | null;
  stream: MediaStream | null;
  isLocal?: boolean;
}

export default function VideoStream({ userName, stream, isLocal }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      console.log('[Client][🎥] VideoStream stream: ', {
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
        controls={true}
        onLoadedMetadata={() => {
          console.log('[Client][🎥] Video metadata loaded for:', userName);
        }}
        onPlay={() => {
          console.log('[Client][🎥] Video started playing for:', userName);
        }}
        onError={(e) => {
          console.error('[Client][🎥] Video error for:', userName, e);
        }}
        className="object-cover w-full h-full"
      />
      <div className="absolute bottom-0 left-0 p-2 text-sm bg-black bg-opacity-50 text-white-default">
        {userName}
      </div>
    </div>
  );
}
