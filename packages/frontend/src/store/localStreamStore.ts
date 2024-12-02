import { create } from 'zustand';

interface ILocalStreamState {
  localStream: MediaStream | null;
  setLocalStream: (stream: MediaStream | null) => void;
}

export const useLocalStreamStore = create<ILocalStreamState>((set) => ({
  localStream: null,
  setLocalStream: (stream) => set({ localStream: stream }),
}));
