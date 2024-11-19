import { ISignalingSocket, IWebRTCPayload } from '@/types/signaling.types';

const handleSignaling = (socket: ISignalingSocket) => {
  // video-offer
  socket.on('video_offer', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('video_offer', {
      offer: data.offer,
      from: socket.id,
      roomId: data.roomId,
    });
  });

  // video-answer
  socket.on('video_answer', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('video_answer', {
      answer: data.answer,
      from: socket.id,
      roomId: data.roomId,
    });
  });

  // new-ice-candidate
  socket.on('new_ice_candidate', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('new_ice_candidate', {
      candidate: data.candidate,
      from: socket.id,
      roomId: data.roomId,
    });
  });
};

export default handleSignaling;
