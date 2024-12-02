import { Socket } from 'socket.io';

const handleSocket = (socket: Socket) => {
  socket.on('disconnect', () => {
    socket.to(socket.data.gsid).emit('disconnect_event', {
      fromUserId: socket.data.userId,
      gsid: socket.data.gsid,
    });
    socket.leave(socket.data.gsid);
    console.log('[Server][🔔] disconnect_event', socket.data.userId, socket.data.gsid);
  });
};

export default handleSocket;
