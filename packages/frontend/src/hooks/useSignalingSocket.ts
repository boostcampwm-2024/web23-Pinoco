import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function useSignalingSocket() {
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
    ],
  });
}
