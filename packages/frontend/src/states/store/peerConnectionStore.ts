import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface IPeerConnection {
  userId: string;
  connection: RTCPeerConnection;
}

interface CreatePeerConnectionParams {
  fromUserId: string;
  signalingSocket: Socket;
  gsid: string;
  localUserId: string | null;
}

interface IPeerConnectionState {
  peerConnections: Map<string, IPeerConnection>;
  remoteStreams: Map<string, MediaStream>;
  createPeerConnection: (params: CreatePeerConnectionParams) => RTCPeerConnection;
  setPeerConnection: (fromUserId: string, connection: RTCPeerConnection) => void;
  setRemoteStream: (fromUserId: string, stream: MediaStream) => void;
  removePeerConnection: (fromUserId: string) => void;
  removeRemoteStream: (fromUserId: string) => void;
  clearConnections: () => void;
}

export const usePeerConnectionStore = create<IPeerConnectionState>((set, get) => ({
  peerConnections: new Map(),
  remoteStreams: new Map(),
  createPeerConnection: (params: CreatePeerConnectionParams) => {
    const { fromUserId, signalingSocket, gsid, localUserId } = params;
    const existingConnection = get().peerConnections.get(fromUserId)?.connection;
    if (existingConnection) return existingConnection;

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: import.meta.env.VITE_TURN_URL,
          username: import.meta.env.VITE_TURN_USERNAME,
          credential: import.meta.env.VITE_TURN_CREDENTIAL,
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        signalingSocket?.emit('new_ice_candidate', {
          candidate: event.candidate,
          fromUserId: localUserId,
          targetUserId: fromUserId,
          gsid,
        });
        console.log('[Client][🎥] Sent ICE candidate to:', fromUserId);
      }
    };

    peerConnection.ontrack = (event) => {
      if (fromUserId) {
        get().setRemoteStream(fromUserId, event.streams[0]);
        console.log('[Client][🎥] Received remote stream for: ', event.streams);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`[Client][🎥] 연결 상태 (${fromUserId}):`, peerConnection.connectionState);
    };

    if (fromUserId) get().setPeerConnection(fromUserId, peerConnection);
    console.log('[Client][🎥] createPeerConnection', fromUserId);
    return peerConnection;
  },

  setPeerConnection: (fromUserId, connection) => {
    set((state) => {
      const newConnections = new Map(state.peerConnections);
      newConnections.set(fromUserId, { userId: fromUserId, connection });
      console.log('[Client][🎥] setPeerConnection', newConnections.get(fromUserId));
      return { peerConnections: newConnections };
    });
  },

  setRemoteStream: (fromUserId, stream) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.set(fromUserId, stream);
      return { remoteStreams: newStreams };
    }),

  removePeerConnection: (fromUserId) =>
    set((state) => {
      const newConnections = new Map(state.peerConnections);
      newConnections.delete(fromUserId);
      return { peerConnections: newConnections };
    }),

  removeRemoteStream: (fromUserId) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.delete(fromUserId);
      return { remoteStreams: newStreams };
    }),

  clearConnections: () =>
    set(() => ({
      peerConnections: new Map(),
      remoteStreams: new Map(),
    })),
}));
