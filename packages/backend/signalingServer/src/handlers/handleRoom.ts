import { IWebRTCPayload } from '@/types/signaling.types';
import { v4 as uuidv4 } from 'uuid';
import { Socket, Server } from 'socket.io';
import { ROOM_ERROR_MESSAGES, ROOM_CONSTANTS } from '@/constants/roomConstants';

const handleRoom = (socket: Socket, io: Server) => {
  socket.on('create_room', () => {
    const gsid = uuidv4();
    socket.join(gsid);
  });

  socket.on('join_room', (payload: IWebRTCPayload) => {
    const room = io.sockets.adapter.rooms.get(payload.gsid);
    validateRoomJoin(socket, room);
    socket.join(payload.gsid);
  });
};

const validateRoomJoin = (socket: Socket, room: Set<string> | undefined) => {
  let errorMessage = '';
  if (room && room.size < ROOM_CONSTANTS.maxParticipants) return true;
  if (!room) errorMessage = ROOM_ERROR_MESSAGES.notFound;
  if (room && room.size >= ROOM_CONSTANTS.maxParticipants) errorMessage = ROOM_ERROR_MESSAGES.full;
  socket.emit('error', {
    errorMessage,
  });
};

export default handleRoom;
