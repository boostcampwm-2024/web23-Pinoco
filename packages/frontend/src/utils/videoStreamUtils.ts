import { useLocalStreamStore } from '@/store/localStreamStore';

export async function getVideoStream() {
  const videoConfig = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };
  try {
    const localStream = await navigator.mediaDevices.getUserMedia(videoConfig);
    useLocalStreamStore.getState().setLocalStream(localStream);
    return localStream;
  } catch (error) {
    return null;
  }
}
