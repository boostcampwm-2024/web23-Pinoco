import { Socket } from 'socket.io';
import { SOCKET_MESSAGES } from '@/constants/socketConstants';

const handleSocket = (socket: Socket) => {
  socket.on('disconnect', () => {
    socket
      .to(socket.data.gsid)
      .emit('user_left', { fromUserId: socket.id, gsid: socket.data.gsid });
    console.log(SOCKET_MESSAGES.disconnect);
  });
};

export default handleSocket;
