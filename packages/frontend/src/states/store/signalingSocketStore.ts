import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';
import { useAuthStore } from '@/states/store/authStore';

interface ISignalingSocketStore {
  signalingSocket: Socket | null;
  connectSignalingSocket: (userId: string) => Promise<void>;
  disconnectSignalingSocket: () => void;
  setupEventHandlers: () => void;
  removeEventHandlers: () => void;
}

export const useSignalingSocketStore = create<ISignalingSocketStore>((set, get) => ({
  signalingSocket: null,
  connectSignalingSocket: (userId: string) => {
    return new Promise((resolve, reject) => {
      const signalingSocket = io('https://pinoco.shop:8080', {
        query: { userId },
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      signalingSocket.on('connect', () => {
        set({ signalingSocket });
        resolve();
      });

      signalingSocket.on('connect_error', (error) => {
        reject(error);
      });
    });
  },

  disconnectSignalingSocket: () => {
    set((state) => {
      state.signalingSocket?.disconnect();
      return { signalingSocket: null };
    });
  },
  setupEventHandlers: () => {
    const signalingSocket = useSignalingSocketStore.getState().signalingSocket;
    const { localStream } = useLocalStreamStore.getState();
    const userId = useAuthStore.getState().userId;
    const {
      peerConnections,
      createPeerConnection,
      setPeerConnection,
      removePeerConnection,
      removeRemoteStream,
      clearConnections,
    } = usePeerConnectionStore.getState();

    if (!signalingSocket || !localStream) return;
    signalingSocket.on('user_joined', async ({ fromUserId }) => {
      const peerConnection = createPeerConnection(fromUserId, signalingSocket);

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingSocket.emit('video_offer', { offer, fromUserId: userId });
    });

    signalingSocket.on('video_offer', async ({ offer, fromUserId }) => {
      const peerConnection = createPeerConnection(fromUserId, signalingSocket);

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      signalingSocket.emit('video_answer', {
        answer,
        targetUserId: fromUserId,
        fromUserId: userId,
      });

      setPeerConnection(fromUserId, peerConnection);
    });

    signalingSocket.on('video_answer', async ({ answer, fromUserId }) => {
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    signalingSocket.on('new_ice_candidate', async ({ candidate, fromUserId }) => {
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    signalingSocket.on('user_left', ({ fromUserId }) => {
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (peerConnection) {
        peerConnection.close();
        removePeerConnection(fromUserId);
        removeRemoteStream(fromUserId);
      }
    });
  },
  removeEventHandlers: () => {
    const { peerConnections, clearConnections } = usePeerConnectionStore.getState();
    const signalingSocket = get().signalingSocket;
    if (!signalingSocket) return;
    signalingSocket.off('user_joined');
    signalingSocket.off('video_offer');
    signalingSocket.off('video_answer');
    signalingSocket.off('video_candidate');
    signalingSocket.off('user_left');
    peerConnections.forEach((peer) => {
      peer.connection.close();
    });
    clearConnections();
  },
}));
