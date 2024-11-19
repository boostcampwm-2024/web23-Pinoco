import { ISignalingSocket, IWebRTCPayload } from '@/types/signaling.types';

const handleSignaling = (socket: ISignalingSocket) => {
  // video-offer
  socket.on('video_offer', (data: IWebRTCPayload) => {
    socket.to(data.ssid).emit('video_offer', {
      offer: data.offer,
      from: socket.id,
      ssid: data.ssid,
    });
  });

  // video-answer
  socket.on('video_answer', (data: IWebRTCPayload) => {
    socket.to(data.ssid).emit('video_answer', {
      answer: data.answer,
      from: socket.id,
      ssid: data.ssid,
    });
  });

  // new-ice-candidate
  socket.on('new_ice_candidate', (data: IWebRTCPayload) => {
    socket.to(data.ssid).emit('new_ice_candidate', {
      candidate: data.candidate,
      from: socket.id,
      ssid: data.ssid,
    });
  });
};

export default handleSignaling;
