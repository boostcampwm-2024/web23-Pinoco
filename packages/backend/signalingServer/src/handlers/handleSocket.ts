import { Socket } from 'socket.io';
import { SOCKET_MESSAGES } from '@/constants/socketConstants';

const handleSocket = (socket: Socket) => {
  socket.on('disconnect', () => {
    console.log(SOCKET_MESSAGES.disconnect);
  });
};

export default handleSocket;
