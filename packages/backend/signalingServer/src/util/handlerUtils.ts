import { Server } from 'socket.io';

export const getRoom = (io: Server, gsid: string) => {
  return io.sockets.adapter.rooms.get(gsid);
};

export const getRoomList = (io: Server) => {
  return io.sockets.adapter.rooms;
};
