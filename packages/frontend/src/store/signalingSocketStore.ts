import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';
import { useLocalStreamStore } from '@/store/localStreamStore';
import { usePeerConnectionStore } from '@/store/peerConnectionStore';
import { getVideoStream } from '@/utils/videoStreamUtils';

interface ISignalingSocketStore {
  userId: string | null;
  signalingSocket: Socket | null;
  connectSignalingSocket: (userId: string) => Promise<void>;
  disconnectSignalingSocket: () => void;
  setupEventHandlers: (signalingSocket: Socket) => void;
  removeEventHandlers: () => void;
}

export const useSignalingSocketStore = create<ISignalingSocketStore>((set, get) => ({
  userId: null,
  signalingSocket: null,
  setUserId: (userId: string) => set({ userId }),
  connectSignalingSocket: (userId: string) => {
    return new Promise((resolve, reject) => {
      set({ userId });
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
      get().setupEventHandlers(signalingSocket);
    });
  },

  disconnectSignalingSocket: () => {
    set((state) => {
      state.signalingSocket?.disconnect();
      return { signalingSocket: null };
    });
  },

  setupEventHandlers: async (signalingSocket: Socket) => {
    const userId = get().userId;
    const { createPeerConnection, setPeerConnection, removePeerConnection, removeRemoteStream } =
      usePeerConnectionStore.getState();

    signalingSocket.on('user_joined', async ({ fromUserId, gsid }) => {
      console.log('[Client][📢] user_joined', fromUserId, gsid);
      const localStream = useLocalStreamStore.getState().localStream;
      const { setRemoteStream } = usePeerConnectionStore.getState();
      const peerConnection = createPeerConnection({
        fromUserId,
        signalingSocket,
        gsid,
        localUserId: userId,
      });
      setRemoteStream(fromUserId, null);
      localStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      const dataChannel = peerConnection.createDataChannel('data');
      dataChannel.onmessage = (event) => {
        console.log('[Client][📢] dataChannel message', event.data);
      };
      dataChannel.onopen = () => {
        console.log('[Client][📢] dataChannel opened');
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingSocket.emit('video_offer', {
        offer,
        fromUserId: userId,
        targetUserId: fromUserId,
        gsid,
      });
      console.log('[Client][📢] video_offer sent to', fromUserId);
    });

    signalingSocket.on('video_offer', async ({ offer, fromUserId, gsid }) => {
      const localStream = useLocalStreamStore.getState().localStream;
      const { setRemoteStream } = usePeerConnectionStore.getState();
      const peerConnection = createPeerConnection({
        fromUserId,
        signalingSocket,
        gsid,
        localUserId: userId,
      });
      setRemoteStream(fromUserId, null);
      localStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onmessage = (event) => {
          console.log('[Client][📢] dataChannel message', event.data);
        };
        dataChannel.onopen = () => {
          console.log('[Client][📢] dataChannel opened');
        };
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      signalingSocket.emit('video_answer', {
        answer,
        targetUserId: fromUserId,
        fromUserId: userId,
        gsid,
      });

      console.log('[Client][📢] video_answer sent to', fromUserId);
    });

    signalingSocket.on('video_answer', async ({ answer, fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('[Client][📢] video_answer from', fromUserId);
    });

    signalingSocket.on('new_ice_candidate', async ({ candidate, fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('[Client][📢] new_ice_candidate', fromUserId);
    });

    signalingSocket.on('user_left', async ({ fromUserId }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      await peerConnection.close();
      removePeerConnection(fromUserId);
      removeRemoteStream(fromUserId);
      console.log('[Client][📢] user_left', fromUserId);
    });

    signalingSocket.on('disconnect_event', async ({ fromUserId, gsid }) => {
      const peerConnections = usePeerConnectionStore.getState().peerConnections;
      const peerConnection = peerConnections.get(fromUserId)?.connection;
      if (!peerConnection) return;
      await peerConnection.close();
      removePeerConnection(fromUserId);
      removeRemoteStream(fromUserId);
      console.log('[Client][📢] disconnect_event', fromUserId, gsid);
    });
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
    peerConnections.forEach((peer) => {
      peer.connection.close();
    });
    clearConnections();
  },
}));
