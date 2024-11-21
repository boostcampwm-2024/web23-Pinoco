import {
  ISignalingSocket,
  IOfferPayload,
  IAnswerPayload,
  ICandidatePayload,
  IRoomPayload,
  ISignalingLogType,
} from '@/types/signaling.types';
import handleLog from '@/util/logUtils';

const handleSignaling = (socket: ISignalingSocket) => {
  // video-offer
  socket.on('video_offer', (data: IOfferPayload) => {
    socket.to(data.targetUserId).emit('video_offer', {
      targetUserId: data.targetUserId,
      offer: data.offer,
    });

    handleLog(socket, {
      type: ISignalingLogType.offer,
      from: socket.data.userId,
      to: data.targetUserId,
    });
  });

  // video-answer
  socket.on('video_answer', (data: IAnswerPayload) => {
    socket.to(data.targetUserId).emit('video_answer', {
      targetUserId: data.targetUserId,
      answer: data.answer,
    });

    handleLog(socket, {
      type: ISignalingLogType.answer,
      from: socket.data.userId,
      to: data.targetUserId,
    });
  });

  // new-ice-candidate
  socket.on('new_ice_candidate', (data: ICandidatePayload) => {
    socket.to(data.targetUserId).emit('new_ice_candidate', {
      targetUserId: data.targetUserId,
      candidate: data.candidate,
    });

    handleLog(socket, {
      type: ISignalingLogType.candidate,
      from: socket.data.userId,
      to: data.targetUserId,
    });
  });

  socket.on('user_left', (data: IRoomPayload) => {
    socket.to(data.gsid).emit('user_left', {
      gsid: data.gsid,
      targetUserId: data.targetUserId,
      fromUserId: socket.data.userId,
    });

    handleLog(socket, {
      type: ISignalingLogType.left,
      from: socket.data.userId,
      to: data.gsid,
    });
  });
};

export default handleSignaling;
