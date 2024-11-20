import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  isPinoco: boolean;
  setRoomData: (gsid: string | null, isHost: boolean, isPinoco: boolean) => void;
}

export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: false,
      gsid: null,
      isPinoco: false,
      setRoomData: (gsid, isHost, isPinoco) => set({ gsid, isHost, isPinoco }),
    }),
    {
      name: 'room-storage',
    },
  ),
);
