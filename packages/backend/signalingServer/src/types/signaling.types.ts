import { Socket } from 'socket.io';

// 방 관련 페이로드
export interface IRoomPayload {
  gsid: string;
  targetUserId?: string;
  fromUserId?: string;
}

// Offer 페이로드
export interface IOfferPayload {
  targetUserId: string;
  offer: RTCSessionDescriptionInit;
}

// 응답 페이로드
export interface IOfferResponse {
  fromUserId: string;
  offer: RTCSessionDescriptionInit;
}

export interface IAnswerPayload {
  targetUserId: string;
  answer: RTCSessionDescriptionInit;
}

// ICE Candidate 페이로드
export interface ICandidatePayload {
  targetUserId: string;
  candidate: RTCIceCandidate;
}

export enum ISignalingLogType {
  offer = 'video_offer',
  answer = 'video_answer',
  candidate = 'new_ice_candidate',
  createRoom = 'create_room',
  joinRoom = 'join_room',
  joined = 'user_joined',
  left = 'user_left',
  error = 'error',
}

export interface ILogData {
  type: ISignalingLogType;
  from: string | null;
  to: string | null;
  gsid?: string;
  isClient?: boolean;
}

export interface IServerEventsType {
  video_offer: (payload: IOfferPayload) => void;
  video_answer: (payload: IAnswerPayload) => void;
  new_ice_candidate: (payload: ICandidatePayload) => void;
  user_joined: (payload: IRoomPayload) => void;
  user_left: (payload: IRoomPayload) => void;
  client_log: (payload: ILogData) => void;
  error: (error: string) => void;
}

export interface IClientEventsType {
  video_offer: (payload: IOfferPayload) => void;
  video_answer: (payload: IAnswerPayload) => void;
  new_ice_candidate: (payload: ICandidatePayload) => void;
  user_joined: (payload: IRoomPayload) => void;
  user_left: (payload: IRoomPayload) => void;
  client_log: (payload: ILogData) => void;
  error: (error: string) => void;
}

export interface ISignalingSocket extends Socket<IServerEventsType, IClientEventsType> {}

// 기존 코드와의 호환성을 위한 타입
export type IWebRTCPayload = IOfferPayload | IAnswerPayload | ICandidatePayload | IRoomPayload;
