import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface ISocketStore {
  socket: Socket | null;
  connectSocket: (userId: string, password: string) => Promise<void>;
  disconnectSocket: () => void;
}

export const useSocketStore = create<ISocketStore>((set) => ({
  socket: null,
  connectSocket: (userId: string, password: string) => {
    return new Promise((resolve, reject) => {
      const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', {
        query: { userId, password },
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        set({ socket });
        resolve();
      });

      socket.on('connect_error', (error) => {
        reject(error);
      });
    });
  },
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));
