import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAuthState {
  userId: string | null;
  usid: string | null;
  setUserData: (userId: string, usid: string) => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      userId: null,
      usid: null,
      setUserData: (userId, usid) => set({ userId, usid }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
