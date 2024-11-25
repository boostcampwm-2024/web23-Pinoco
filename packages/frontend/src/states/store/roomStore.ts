import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  isPinoco: boolean;
  allUsers: Set<string>;
  setRoomData: (gsid: string | null, isHost: boolean, isPinoco: boolean) => void;
  setIsPinoco: (isPinoco: boolean) => void;
  setAllUsers: (allUsers: string[]) => void;
  addUser: (userId: string) => void;
  removeUser: (userId: string) => void;
}
export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: false,
      gsid: null,
      isPinoco: false,
      allUsers: new Set(),
      setRoomData: (gsid, isHost, isPinoco) => set({ gsid, isHost, isPinoco }),
      setIsPinoco: (isPinoco) => set({ isPinoco }),
      setAllUsers: (allUsers) => set({ allUsers: new Set(allUsers) }),
      addUser: (userId) =>
        set((state) => ({
          allUsers: new Set([...state.allUsers, userId]),
        })),
      removeUser: (userId) =>
        set((state) => ({
          allUsers: new Set([...state.allUsers].filter((id) => id !== userId)),
        })),
    }),
    { name: 'room-storage' },
  ),
);
