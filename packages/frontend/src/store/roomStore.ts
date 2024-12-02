import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  isPinoco: boolean;
  allUsers: Set<string>;
  readyUsers: string[];
  setRoomData: (gsid: string | null, isHost: boolean, isPinoco: boolean) => void;
  setIsPinoco: (isPinoco: boolean) => void;
  setAllUsers: (allUsers: string[]) => void;
  addUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  setIsHost: (isHost: boolean) => void;
  setReadyUsers: (readyUsers: string[]) => void;
  addReadyUser: (userId: string) => void;
  removeReadyUser: (userId: string) => void;
}
export const useRoomStore = create<IRoomState>()(
  persist(
    (set) => ({
      isHost: false,
      gsid: null,
      isPinoco: false,
      allUsers: new Set(),
      readyUsers: [],

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
      setIsHost: (isHost) => set({ isHost }),

      setReadyUsers: (readyUsers) => set({ readyUsers }),
      addReadyUser: (userId) =>
        set((state) => ({
          readyUsers: [...state.readyUsers, userId],
        })),
      removeReadyUser: (userId) =>
        set((state) => ({
          readyUsers: state.readyUsers.filter((id) => id !== userId),
        })),
    }),
    { name: 'room-storage' },
  ),
);
