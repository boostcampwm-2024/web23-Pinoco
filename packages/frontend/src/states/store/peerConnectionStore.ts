import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface IPeerConnection {
  userId: string;
  connection: RTCPeerConnection;
}

interface IPeerConnectionState {
  peerConnections: Map<string, IPeerConnection>;
  remoteStreams: Map<string, MediaStream>;
  createPeerConnection: (userId: string, signalingSocket: Socket) => RTCPeerConnection;
  setPeerConnection: (userId: string, connection: RTCPeerConnection) => void;
  setRemoteStream: (userId: string, stream: MediaStream) => void;
  removePeerConnection: (userId: string) => void;
  removeRemoteStream: (userId: string) => void;
  clearConnections: () => void;
}

export const usePeerConnectionStore = create<IPeerConnectionState>((set, get) => ({
  peerConnections: new Map(),
  remoteStreams: new Map(),
  createPeerConnection: (userId: string, signalingSocket: Socket) => {
    const existingConnection = get().peerConnections.get(userId)?.connection;
    if (existingConnection) return existingConnection;

    const peerConnection = new RTCPeerConnection({
      iceServers: [
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
          fromUserId: userId,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      get().setRemoteStream(userId, event.streams[0]);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`연결 상태 (${userId}):`, peerConnection.connectionState);
    };

    get().setPeerConnection(userId, peerConnection);
    return peerConnection;
  },

  setPeerConnection: (userId, connection) =>
    set((state) => {
      const newConnections = new Map(state.peerConnections);
      newConnections.set(userId, { userId, connection });
      return { peerConnections: newConnections };
    }),

  setRemoteStream: (userId, stream) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.set(userId, stream);
      return { remoteStreams: newStreams };
    }),

  removePeerConnection: (userId) =>
    set((state) => {
      const newConnections = new Map(state.peerConnections);
      newConnections.delete(userId);
      return { peerConnections: newConnections };
    }),

  removeRemoteStream: (userId) =>
    set((state) => {
      const newStreams = new Map(state.remoteStreams);
      newStreams.delete(userId);
      return { remoteStreams: newStreams };
    }),

  clearConnections: () =>
    set(() => ({
      peerConnections: new Map(),
      remoteStreams: new Map(),
    })),
}));
