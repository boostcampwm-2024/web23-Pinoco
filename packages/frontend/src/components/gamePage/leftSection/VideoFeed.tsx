import { memo } from 'react';
import VideoStream from '@/components/gamePage/stream/VideoStream';
import { useAuthStore } from '@/store/authStore';
import { useLocalStreamStore } from '@/store/localStreamStore';
import { usePeerConnectionStore } from '@/store/peerConnectionStore';
import { useRoomStore } from '@/store/roomStore';

const MemoizedVideoStream = memo(VideoStream);

const EmptySlot = memo(({ idx, height }: { idx: number; height: string }) => (
  <MemoizedVideoStream stream={null} userName={`빈 슬롯 ${idx + 1}`} height={height} />
));

const VideoFeed = memo(function VideoFeed() {
  const localStream = useLocalStreamStore((state) => state.localStream);
  const remoteStreams = usePeerConnectionStore((state) => state.remoteStreams);
  const { userId } = useAuthStore();
  const feedHeight = 'h-[180px]';
  const readyUsers = useRoomStore((state) => state.readyUsers);
  const isUserReady = (userId: string) => readyUsers.includes(userId);

  return (
    <>
      <div
        className={`relative rounded-lg`}
        style={{
          boxShadow: isUserReady(userId || '') ? '0 0 0 4px white' : '',
        }}
      >
        <MemoizedVideoStream
          stream={localStream}
          userName={userId}
          isLocal={true}
          height={feedHeight}
        />
        {isUserReady(userId || '') && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 font-bold text-orange-500 bg-white rounded-full">READY</span>
          </div>
        )}
      </div>
      {Array.from(remoteStreams).map(([remoteUserId, stream]) => (
        <div
          key={remoteUserId}
          className={`relative ${
            isUserReady(remoteUserId) ? 'border-4 border-white' : ''
          } rounded-lg`}
        >
          <MemoizedVideoStream
            stream={stream}
            userName={remoteUserId}
            isLocal={false}
            height={feedHeight}
          />
          {isUserReady(remoteUserId) && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 font-bold text-orange-500 bg-white rounded-full">
                READY
              </span>
            </div>
          )}
        </div>
      ))}
      {[...Array(Math.max(0, 5 - remoteStreams.size))].map((_, idx) => (
        <EmptySlot key={`empty-${idx}`} idx={idx} height={feedHeight} />
      ))}
    </>
  );
});

export default VideoFeed;
