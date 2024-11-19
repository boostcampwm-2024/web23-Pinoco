import { IWebRTCPayload } from '@/types/signaling.types';
import { v4 as uuidv4 } from 'uuid';
import { Socket, Server } from 'socket.io';
import { ROOM_ERROR_MESSAGES, ROOM_CONSTANTS } from '@/constants/roomConstants';

const handleRoom = (socket: Socket, io: Server) => {
  socket.on('create_room', () => {
    const ssid = uuidv4();
    socket.join(ssid);
    socket.emit('create_room_success', {
      ssid,
      isHost: true,
    });
  });

  socket.on('join_room', (payload: IWebRTCPayload) => {
    const room = io.sockets.adapter.rooms.get(payload.ssid);
    validateRoomJoin(socket, room);
    socket.join(payload.ssid);
    socket.emit('join_room_success', {
      ssid: payload.ssid,
      isHost: false,
    });
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
