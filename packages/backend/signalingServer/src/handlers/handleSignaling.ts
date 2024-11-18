import { ISignalingSocket, IWebRTCPayload } from '../types/signaling.types';

const handleSignaling = (socket: ISignalingSocket) => {
  // video-offer
  socket.on('video-offer', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('video-offer', {
      offer: data.offer,
      from: socket.id,
      roomId: data.roomId,
    });
  });

  // video-answer
  socket.on('video-answer', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('video-answer', {
      answer: data.answer,
      from: socket.id,
      roomId: data.roomId,
    });
  });

  // new-ice-candidate
  socket.on('new-ice-candidate', (data: IWebRTCPayload) => {
    socket.to(data.roomId).emit('new-ice-candidate', {
      candidate: data.candidate,
      from: socket.id,
      roomId: data.roomId,
    });
  });
};

export default handleSignaling;
