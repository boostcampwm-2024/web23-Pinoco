import { useRef, useEffect } from 'react';
import VideoStream from '@/components/gamePage/stream/VideoStream';
import { useAuthStore } from '@/states/store/authStore';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';

export default function VideoFeed() {
  const localStream = useLocalStreamStore((state) => state.localStream);
  const remoteStreams = usePeerConnectionStore((state) => state.remoteStreams);
  const { userId } = useAuthStore();
  const feedHeight = 'h-[180px]';

  return (
    <>
      <VideoStream stream={localStream} userName={userId} isLocal={true} height={feedHeight} />
      {Array.from(remoteStreams).map(([userId, stream]) => (
        <VideoStream
          key={userId}
          stream={stream}
          userName={userId}
          isLocal={false}
          height={feedHeight}
        />
      ))}
      {[...Array(Math.max(0, 5 - remoteStreams.size))].map((_, idx) => (
        <VideoStream
          key={`empty-${idx}`}
          stream={null}
          userName={`빈 슬롯 ${idx + 1}`}
          height={feedHeight}
        />
      ))}
    </>
  );
}
