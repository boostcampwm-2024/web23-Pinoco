import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';
import { useLocalStreamStore } from '@/states/store/localStreamStore';
import { usePeerConnectionStore } from '@/states/store/peerConnectionStore';

interface ISignalingSocketStore {
  userId: string | null;
  signalingSocket: Socket | null;
  connectSignalingSocket: (userId: string) => Promise<void>;
  disconnectSignalingSocket: () => void;
  setupEventHandlers: (signalingSocket: Socket, localStream: MediaStream) => void;
  removeEventHandlers: () => void;
}

export const useSignalingSocketStore = create<ISignalingSocketStore>((set, get) => ({
  userId: null,
  signalingSocket: null,
  setUserId: (userId: string) => set({ userId }),
  connectSignalingSocket: (userId: string) => {
    return new Promise((resolve, reject) => {
      set({ userId });
      const localStream = useLocalStreamStore.getState().localStream;
      const signalingSocket = io(import.meta.env.VITE_SIGNALING_SERVER_URL, {
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

      if (!localStream) {
        reject(new Error('No local stream available'));
        return;
      }

      get().setupEventHandlers(signalingSocket, localStream);
    });
  },

  disconnectSignalingSocket: () => {
    set((state) => {
      state.signalingSocket?.disconnect();
      return { signalingSocket: null };
    });
  },
  setupEventHandlers: (signalingSocket: Socket, localStream: MediaStream) => {
    const userId = get().userId;
    const { createPeerConnection, setPeerConnection, removePeerConnection, removeRemoteStream } =
      usePeerConnectionStore.getState();

    signalingSocket.on('user_joined', async ({ fromUserId, gsid }) => {
      console.log('[Client][📢] user_joined', fromUserId, gsid);
      const peerConnection = createPeerConnection({
        fromUserId,
        signalingSocket,
        gsid,
        localUserId: userId,
      });
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingSocket.emit('video_offer', {
        offer,
        fromUserId: userId,
        targetUserId: fromUserId,
        gsid,
      });
    });

    signalingSocket.on('video_offer', async ({ offer, fromUserId, gsid }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      let peerConnection = peerConnections.get(fromUserId)?.connection;

      if (!peerConnection) {
        console.log('Creating new peer connection');
        peerConnection = createPeerConnection({
          fromUserId,
          signalingSocket,
          gsid,
          localUserId: userId,
        });
      }

      if (!localStream) {
        console.error('No local stream available');
        return;
      }
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
        gsid,
      });
      setPeerConnection(fromUserId, peerConnection);
      console.log('[Client][📢] video_answer sent');
    });

    signalingSocket.on('video_answer', ({ answer, fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('[Client][📢] video_answer', fromUserId);
    });

    signalingSocket.on('new_ice_candidate', ({ candidate, fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('[Client][📢] new_ice_candidate', fromUserId);
    });

    signalingSocket.on('user_left', ({ fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      peerConnection.close();
      removePeerConnection(fromUserId);
      removeRemoteStream(fromUserId);
      console.log('[Client][📢] user_left', fromUserId);
    });

    console.log('[Client][🔔] setupEventHandlers');
  },
  removeEventHandlers: () => {
    console.log('[Client][🔔] removeEventHandlers');
    const { peerConnections, clearConnections } = usePeerConnectionStore.getState();
    const signalingSocket = get().signalingSocket;
    if (!signalingSocket) return;
    signalingSocket.off('user_joined');
    signalingSocket.off('video_offer');
    signalingSocket.off('video_answer');
    signalingSocket.off('new_ice_candidate');
    signalingSocket.off('user_left');
    signalingSocket.off('ping');
    peerConnections.forEach((peer) => {
      peer.connection.close();
    });
    clearConnections();
  },
}));
