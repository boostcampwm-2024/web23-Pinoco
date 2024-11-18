import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAuthState {
  userId: string | null;
  password: string | null;
  setUserData: (userId: string, password: string) => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      userId: null,
      password: null,
      setUserData: (userId, password) => set({ userId, password }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
