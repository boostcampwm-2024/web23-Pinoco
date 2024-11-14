import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  gsid: string | null;
  setGsid: (gsid: string) => void;
}

export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      gsid: null,
      setGsid: (gsid) => set({ gsid }),
    }),
    {
      name: 'room-storage',
    },
  ),
);
