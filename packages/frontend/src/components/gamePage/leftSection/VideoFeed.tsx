import { useRef, useEffect } from 'react';
import VideoStream from '@/components/gamePage/stream/VideoStream';
import { useAuthStore } from '@/states/store/authStore';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';
import { useReadyStatus } from '@/hooks/useReadyStatus';

export default function VideoFeed() {
  const localStream = useLocalStreamStore((state) => state.localStream);
  const remoteStreams = usePeerConnectionStore((state) => state.remoteStreams);
  const { userId } = useAuthStore();
  const feedHeight = 'h-[180px]';
  const { isUserReady } = useReadyStatus();

  return (
    <>
      <div
        className={`relative ${
          isUserReady(userId || '') ? 'border-4 border-white' : ''
        } rounded-lg`}
      >
        <VideoStream stream={localStream} userName={userId} isLocal={true} height={feedHeight} />
        {isUserReady(userId || '') && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 text-orange-500 font-bold bg-white rounded-full">READY</span>
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
          <VideoStream
            stream={stream}
            userName={remoteUserId}
            isLocal={false}
            height={feedHeight}
          />
          {isUserReady(remoteUserId) && (
            <div className="absolute bottom-2 right-2 animate-spin-slow">
              <span className="px-2 py-1 text-orange-500 font-bold bg-white rounded-full">
                READY
              </span>
            </div>
          )}
        </div>
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
