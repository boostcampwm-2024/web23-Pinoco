import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  isPinoco: boolean;
  allUsers: string[];
  setRoomData: (gsid: string | null, isHost: boolean, isPinoco: boolean) => void;
  setIsPinoco: (isPinoco: boolean) => void;
  setAllUsers: (allUsers: string[]) => void;
}
export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: false,
      gsid: null,
      isPinoco: false,
      allUsers: [],
      setRoomData: (gsid, isHost, isPinoco) => set({ gsid, isHost, isPinoco }),
      setIsPinoco: (isPinoco) => set({ isPinoco }),
      setAllUsers: (allUsers) => set({ allUsers }),
    }),
    { name: 'room-storage' },
  ),
);
