import { Server } from 'socket.io';
import {
  ISignalingSocket,
  IOfferPayload,
  IAnswerPayload,
  ICandidatePayload,
  IRoomPayload,
} from '@/types/signaling.types';
import { getTargetSocket } from '@/util/handlerUtils';
import { getRoom } from '@/util/handlerUtils';
import { ROOM_CONSTANTS } from '@/constants/roomConstants';

const handleSignaling = (socket: ISignalingSocket, io: Server) => {
  socket.on('create_room', async (payload: IRoomPayload) => {
    await socket.join(payload.gsid);
    socket.data.gsid = payload.gsid;
    console.log('[Server][🎥] create_room', payload.gsid);
  });
  socket.on('join_room', async (payload: IRoomPayload) => {
    const roomSize = await getRoom(io, payload.gsid)?.size;
    if (!roomSize || roomSize >= ROOM_CONSTANTS.maxParticipants) return;
    socket.data.gsid = payload.gsid;
    await socket.join(payload.gsid);
    console.log('[Server][🎥] join_room', payload.gsid);
    socket
      .to(payload.gsid)
      .emit('user_joined', { fromUserId: socket.data.userId, gsid: payload.gsid });
  });
  socket.on('video_offer', async (payload: IOfferPayload) => {
    const targetSocket = await getTargetSocket(io, payload.targetUserId);
    if (!targetSocket) return;
    targetSocket.emit('video_offer', payload);
    console.log('[Server][🎥] video_offer', payload.fromUserId);
  });
  socket.on('video_answer', async (payload: IAnswerPayload) => {
    const targetSocket = await getTargetSocket(io, payload.targetUserId);
    if (!targetSocket) return;
    targetSocket.emit('video_answer', payload);
    console.log('[Server][🎥] video_answer', payload.fromUserId);
  });
  socket.on('new_ice_candidate', async (payload: ICandidatePayload) => {
    const targetSocket = await getTargetSocket(io, payload.targetUserId);
    if (!targetSocket) return;
    targetSocket.emit('new_ice_candidate', payload);
    console.log('[Server][🎥] new_ice_candidate', payload.fromUserId);
  });
  socket.on('leave_room', async () => {
    const gsid = socket.data.gsid;
    const fromUserId = socket.data.userId;
    const targetSocket = await getTargetSocket(io, fromUserId);
    if (!targetSocket) return;
    targetSocket.leave(gsid);
    socket.to(gsid).emit('user_left', { fromUserId, gsid });
    console.log('[Server][🎥] user_left', fromUserId);
  });
};

export default handleSignaling;
