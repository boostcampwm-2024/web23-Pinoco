import { IRoomPayload, ISignalingLogType } from '@/types/signaling.types';
import { Socket, Server } from 'socket.io';
import { ROOM_ERROR_MESSAGES, ROOM_CONSTANTS } from '@/constants/roomConstants';
import handleLog from '@/util/logUtils';
import { getRoom } from '@/util/handlerUtils';

const handleRoom = (socket: Socket, io: Server) => {
  socket.on('create_room', (payload: IRoomPayload) => {
    const room = getRoom(io, payload.gsid);
    validateRoomCreate(socket, room);
    socket.join(payload.gsid);
    console.log(`[Server][🎮] create_room: from ${socket.data.userId} to ${payload.gsid}`);
  });

  socket.on('join_room', (payload: IRoomPayload) => {
    const room = getRoom(io, payload.gsid);
    validateRoomJoin(socket, room);
    socket.join(payload.gsid);
    console.log(
      `[Server][🚪] join_room: from ${socket.data.userId} to ${payload.gsid} (roomSize: ${getRoom(io, payload.gsid)?.size})`,
    );
    socket.to(payload.gsid).emit('user_joined', {
      gsid: payload.gsid,
      fromUserId: socket.data.userId,
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
  if (room) return;
  socket.emit('error', {
    errorMessage: ROOM_ERROR_MESSAGES.alreadyExists,
  });
};

export default handleRoom;
