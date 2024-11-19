import { Server } from 'socket.io';
import { ISignalingSocket } from '@/types/signaling.types';
import handleSignaling from '@/handlers/handleSignaling';
import handleSocket from '@/handlers/handleSocket';
import corsConfig from '@/middleware/cors';
import { Server as HttpServer } from 'http';

export default function initSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: corsConfig,
  });

  io.on('connection', (socket: ISignalingSocket) => {
    console.log('클라이언트가 연결되었습니다:', socket.id);
    handleSignaling(socket);
    handleSocket(socket);
  });

  return io;
}
