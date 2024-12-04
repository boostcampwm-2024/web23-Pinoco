import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IRoomState {
  isHost: boolean;
  gsid: string | null;
  isPinoco: boolean;
  allUsers: Set<string>;
  readyUsers: string[];
  hostUserId: string | null;
  setRoomData: (
    gsid: string | null,
    isHost: boolean,
    isPinoco: boolean,
    hostUserId: string,
  ) => void;
  setIsPinoco: (isPinoco: boolean) => void;
  setAllUsers: (allUsers: string[]) => void;
  addUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  setIsHost: (isHost: boolean) => void;
  setReadyUsers: (readyUsers: string[]) => void;
  addReadyUser: (userId: string) => void;
  removeReadyUser: (userId: string) => void;
  setHostUserId: (hostUserId: string) => void;
}

export const useRoomStore = create<IRoomState>()(
  persist(
    (set, get) => ({
      isHost: false,
      gsid: null,
      isPinoco: false,
      allUsers: new Set(),
      readyUsers: [],
      hostUserId: null,

      setRoomData: (gsid, isHost, isPinoco, hostUserId) =>
        set((state) => {
          if (state.gsid === gsid && state.isHost === isHost && state.isPinoco === isPinoco) {
            return state;
          }
          return { gsid, isHost, isPinoco, hostUserId };
        }),

      setIsPinoco: (isPinoco) =>
        set((state) => {
          if (state.isPinoco === isPinoco) return state;
          return { isPinoco };
        }),

      setAllUsers: (allUsers) =>
        set((state) => {
          const newUsers = new Set(allUsers);
          if (JSON.stringify([...state.allUsers]) === JSON.stringify([...newUsers])) {
            return state;
          }
          return { allUsers: newUsers };
        }),

      addUser: (userId) =>
        set((state) => {
          if (state.allUsers.has(userId)) return state;
          return {
            allUsers: new Set([...state.allUsers, userId]),
          };
        }),

      removeUser: (userId) =>
        set((state) => {
          if (!state.allUsers.has(userId)) return state;
          const newUsers = new Set([...state.allUsers]);
          newUsers.delete(userId);
          return { allUsers: newUsers };
        }),

      setIsHost: (isHost) =>
        set((state) => {
          if (state.isHost === isHost) return state;
          return { isHost };
        }),
      setReadyUsers: (readyUsers) =>
        set((state) => {
          if (JSON.stringify(state.readyUsers) === JSON.stringify(readyUsers)) {
            return state;
          }
          return { readyUsers };
        }),

      addReadyUser: (userId) =>
        set((state) => {
          if (state.readyUsers.includes(userId)) return state;
          return {
            readyUsers: [...state.readyUsers, userId],
          };
        }),

      removeReadyUser: (userId) =>
        set((state) => {
          if (!state.readyUsers.includes(userId)) return state;
          return {
            readyUsers: state.readyUsers.filter((id) => id !== userId),
          };
        }),
      setHostUserId: (hostUserId) => set({ hostUserId }),
    }),
    { name: 'room-storage' },
  ),
);
