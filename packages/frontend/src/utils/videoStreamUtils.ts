import { useLocalStreamStore } from '@/store/localStreamStore';

interface IMediaStreamProps {
  videoDeviceId?: string;
  audioDeviceId?: string;
}

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
    await handleMediaDevices({ videoDeviceId: '', audioDeviceId: '' });
    return localStream;
  } catch (error) {
    return null;
  }
}

async function getTargetMediaDevices({ videoDeviceId, audioDeviceId }: IMediaStreamProps) {
  const currentVideoDevice = useLocalStreamStore.getState().currentVideoDevice;
  const currentAudioDevice = useLocalStreamStore.getState().currentAudioDevice;
  const videoId = videoDeviceId || currentVideoDevice?.deviceId;
  const audioId = audioDeviceId || currentAudioDevice?.deviceId;
  const videoConfig = {
    video: { deviceId: videoId },
    audio: {
      deviceId: audioId,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };
  try {
    const localStream = await navigator.mediaDevices.getUserMedia(videoConfig);
    await handleMediaDevices({ videoDeviceId, audioDeviceId });
    return localStream;
  } catch (error) {
    return null;
  }
}

async function handleMediaDevices({ videoDeviceId, audioDeviceId }: IMediaStreamProps) {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');
  const videoDevices = devices.filter((device) => device.kind === 'videoinput');
  const currentVideoDevice = videoDeviceId
    ? videoDevices.find((device) => device.deviceId === videoDeviceId)
    : null;
  const currentAudioDevice = audioDeviceId
    ? audioInputDevices.find((device) => device.deviceId === audioDeviceId)
    : null;
  useLocalStreamStore.getState().setAudioInputDevices(audioInputDevices);
  useLocalStreamStore.getState().setVideoDevices(videoDevices);
  if (videoDeviceId)
    useLocalStreamStore.getState().setCurrentVideoDevice(currentVideoDevice || null);
  if (audioDeviceId)
    useLocalStreamStore.getState().setCurrentAudioDevice(currentAudioDevice || null);
}

export async function changeMediaDevice({ videoDeviceId, audioDeviceId }: IMediaStreamProps) {
  const localStream = useLocalStreamStore.getState().localStream;
  const videoTrack = localStream?.getVideoTracks()[0];
  if (videoTrack) videoTrack.stop();
  const newStream = await getTargetMediaDevices({ videoDeviceId, audioDeviceId });
  useLocalStreamStore.getState().setLocalStream(newStream);
  await handleMediaDevices({ videoDeviceId, audioDeviceId });
}
