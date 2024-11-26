import { Server } from 'socket.io';
import {
  ISignalingSocket,
  IOfferPayload,
  IAnswerPayload,
  ICandidatePayload,
  IRoomPayload,
} from '@/types/signaling.types';
import { getTargetSocket } from '@/util/handlerUtils';

const handleSignaling = (socket: ISignalingSocket, io: Server) => {
  socket.on('create_room', async (payload: IRoomPayload) => {
    await socket.join(payload.gsid);
    socket.data.gsid = payload.gsid;
  });
  socket.on('join_room', async (payload: IRoomPayload) => {
    await socket.join(payload.gsid);
    socket.data.gsid = payload.gsid;
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
  socket.on('user_left', async (payload: IRoomPayload) => {
    socket.to(payload.gsid).emit('user_left', payload);
    console.log('[Server][🎥] user_left', payload.fromUserId);
  });
};

export default handleSignaling;
