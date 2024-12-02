import { create } from 'zustand';

interface ILocalStreamState {
  localStream: MediaStream | null;
  videoDevices: MediaDeviceInfo[];
  audioInputDevices: MediaDeviceInfo[];
  currentVideoDevice: MediaDeviceInfo | null;
  currentAudioDevice: MediaDeviceInfo | null;
  setLocalStream: (stream: MediaStream | null) => void;
  setVideoDevices: (devices: MediaDeviceInfo[]) => void;
  setAudioInputDevices: (devices: MediaDeviceInfo[]) => void;
  setCurrentVideoDevice: (device: MediaDeviceInfo | null) => void;
  setCurrentAudioDevice: (device: MediaDeviceInfo | null) => void;
}

export const useLocalStreamStore = create<ILocalStreamState>((set) => ({
  localStream: null,
  videoDevices: [],
  audioInputDevices: [],
  currentVideoDevice: null,
  currentAudioDevice: null,
  setLocalStream: (stream) => set({ localStream: stream }),
  setVideoDevices: (devices) => set({ videoDevices: devices }),
  setAudioInputDevices: (devices) => set({ audioInputDevices: devices }),
  setCurrentVideoDevice: (device) => set({ currentVideoDevice: device }),
  setCurrentAudioDevice: (device) => set({ currentAudioDevice: device }),
}));
