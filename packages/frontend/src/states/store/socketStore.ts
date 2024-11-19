import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface ISocketStore {
  socket: Socket | null;
  connectSocket: (userId: string, password: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<ISocketStore>((set) => ({
  socket: null,
  connectSocket: (userId: string, password: string) => {
    const socket = io('http://localhost:3000', {
      query: { userId, password },
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });
    set({ socket });
  },
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));
