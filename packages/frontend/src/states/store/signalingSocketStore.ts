import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface ISignalingSocketStore {
  signalingSocket: Socket | null;
  connectSignalingSocket: (userId: string) => Promise<void>;
  disconnectSignalingSocket: () => void;
}

export const useSignalingSocketStore = create<ISignalingSocketStore>((set) => ({
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
}));
