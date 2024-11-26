import { Server } from 'socket.io';

export const getRoom = (io: Server, gsid: string) => {
  return io.sockets.adapter.rooms.get(gsid);
};

export const getRoomList = (io: Server) => {
  return io.sockets.adapter.rooms;
};

export const getTargetSocket = async (io: Server, userId: string) => {
  const sockets = await io.fetchSockets();
  return sockets.find((socket) => socket.data.userId === userId);
};
