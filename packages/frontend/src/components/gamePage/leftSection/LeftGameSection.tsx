import VideoFeed from './VideoFeed';
import MainDisplay from './MainDisplay';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import { useAuthStore } from '@/states/store/authStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';

export default function LeftGameSection() {
  const { localStream } = useLocalStreamStore();
  const remoteStreams = usePeerConnectionStore((state) => state.remoteStreams);
  const { userId } = useAuthStore();

  return (
    <div className="flex flex-col w-2/3 p-4 space-y-4 bg-transparent">
      <div className="grid grid-cols-3 gap-4">
        <VideoFeed stream={localStream} userName={userId} isLocal={true} />

        {Array.from(remoteStreams).map(([userId, stream]) => (
          <VideoFeed key={userId} stream={stream} userName={userId} />
        ))}

        {[...Array(Math.max(0, 5 - remoteStreams.size))].map((_, idx) => (
          <VideoFeed key={`empty-${idx}`} stream={null} userName={`빈 슬롯 ${idx + 1}`} />
        ))}
      </div>
      <MainDisplay />
    </div>
  );
}
