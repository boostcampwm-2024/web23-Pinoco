import { useEffect } from 'react';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';
import { useLocalStreamStore } from '@/states/store/localStreamStore';

export default function useSignalingSocket(gsid: string) {
  const { signalingSocket, setupEventHandlers, removeEventHandlers } = useSignalingSocketStore();
  const { peerConnections, remoteStreams } = usePeerConnectionStore();
  const { localStream } = useLocalStreamStore();

  useEffect(() => {
    if (!signalingSocket || !localStream) return;
    setupEventHandlers();
    return () => removeEventHandlers();
  }, [signalingSocket, localStream]);

  return {
    peerConnections,
    remoteStreams,
  };
}
