import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  setRoomData: (gsid: string, isHost: boolean) => void;
}

export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: null,
      gsid: null,
      setRoomData: (isHost, gsid) => set({ isHost, gsid }),
    }),
    {
      name: 'room-storage',
    },
  ),
);
