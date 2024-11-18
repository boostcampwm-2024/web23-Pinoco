import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  isHost: boolean | null;
  gsid: string | null;
  setRoomData: (gsid: string, isHost: boolean) => void;
}

export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: null,
      gsid: null,
      setRoomData: (gsid, isHost) => set({ gsid, isHost }),
    }),
    {
      name: 'room-storage',
    },
  ),
);
