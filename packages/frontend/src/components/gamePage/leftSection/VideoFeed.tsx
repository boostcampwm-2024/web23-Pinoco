import { useRef, useEffect } from 'react';

interface VideoFeedProps {
  userName: string;
}

export default function VideoFeed({ userName }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    }
    startStream();
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-700 rounded-lg min-h-32">
      <video ref={videoRef} autoPlay playsInline className="object-cover w-full h-full" />
      <div className="absolute bottom-0 left-0 p-2 text-sm bg-black bg-opacity-50 text-white-default">
        {userName}
      </div>
    </div>
  );
}
