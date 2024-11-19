import { IWebRTCPayload } from '@/types/signaling.types';
import { Socket } from 'socket.io';

const handleSocket = (socket: Socket) => {
  socket.on('join_room', (payload: IWebRTCPayload) => {
    socket.join(payload.roomId);
  });
  socket.on('disconnect', () => {
    console.log('User Socket disconnected');
  });
};

export default handleSocket;
