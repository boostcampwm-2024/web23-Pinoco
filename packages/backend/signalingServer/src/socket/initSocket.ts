import { Server } from 'socket.io';
import { ISignalingSocket } from '@/types/signaling.types';
import handleSignaling from '@/handlers/handleSignaling';
import handleSocket from '@/handlers/handleSocket';
import corsConfig from '@/middleware/cors';
import { Server as HttpServer } from 'http';
import { SOCKET_MESSAGES } from '@/constants/socketConstants';

export default function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: corsConfig,
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: ISignalingSocket) => {
    const userId = socket.handshake.query.userId;
    socket.data.userId = userId;
    console.log(SOCKET_MESSAGES.connection, socket.data.userId);
    handleSignaling(socket, io);
    handleSocket(socket);
  });

  return io;
}
