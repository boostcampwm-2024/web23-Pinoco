import { IWebRTCPayload } from '@/types/signaling.types';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const handleSocket = (socket: Socket) => {
  socket.on('create_room', () => {
    const ssid = uuidv4();
    socket.join(ssid);
    socket.emit('create_room_success', {
      ssid,
      isHost: true,
    });
  });
  socket.on('join_room', (payload: IWebRTCPayload) => {
    socket.join(payload.ssid);
    socket.emit('join_room_success', {
      ssid: payload.ssid,
      isHost: false,
    });
  });
  socket.on('disconnect', () => {
    console.log('User Socket disconnected');
  });
};

export default handleSocket;
