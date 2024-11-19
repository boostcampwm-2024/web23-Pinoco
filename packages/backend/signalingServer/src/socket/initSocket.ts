import { Server } from 'socket.io';
import { ISignalingSocket } from '@/types/signaling.types';
import handleSignaling from '@/handlers/handleSignaling';
import handleSocket from '@/handlers/handleSocket';
import handleRoom from '@/handlers/handleRoom';
import corsConfig from '@/middleware/cors';
import { Server as HttpServer } from 'http';
import { SOCKET_MESSAGES } from '@/constants/socketConstants';

export default function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: corsConfig,
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: ISignalingSocket) => {
    console.log(SOCKET_MESSAGES.connection, socket.id);
    handleSignaling(socket);
    handleSocket(socket);
    handleRoom(socket, io);
  });

  return io;
}
