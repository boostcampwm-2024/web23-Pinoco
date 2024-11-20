import { IWebRTCPayload } from '@/types/signaling.types';
import { Socket, Server } from 'socket.io';
import { ROOM_ERROR_MESSAGES, ROOM_CONSTANTS } from '@/constants/roomConstants';
import { logRoomStatus, LogType } from '@/util/logUtils';
import { getRoom, getRoomList } from '@/util/handlerUtils';

const handleRoom = (socket: Socket, io: Server) => {
  socket.on('create_room', (payload: IWebRTCPayload) => {
    const room = getRoom(io, payload.gsid);
    validateRoomCreate(socket, room);
    socket.join(payload.gsid);
    logRoomStatus({
      roomList: getRoomList(io),
      room: getRoom(io, payload.gsid),
      type: LogType.create,
      gsid: payload.gsid,
    });
  });

  socket.on('join_room', (payload: IWebRTCPayload) => {
    const room = getRoom(io, payload.gsid);
    validateRoomJoin(socket, room);
    socket.join(payload.gsid);
    logRoomStatus({
      roomList: getRoomList(io),
      room: getRoom(io, payload.gsid),
      type: LogType.join,
      gsid: payload.gsid,
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

const validateRoomCreate = (socket: Socket, room: Set<string> | undefined) => {
  if (!room) return;
  socket.emit('error', {
    errorMessage: ROOM_ERROR_MESSAGES.alreadyExists,
  });
};

export default handleRoom;
