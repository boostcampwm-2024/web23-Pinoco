import { Socket } from 'socket.io';

export interface IWebRTCPayload {
  roomId: string;
  userID?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  from?: string;
}

export interface IServerEventsType {
  'video-offer': (payload: IWebRTCPayload) => void;
  'video-answer': (payload: IWebRTCPayload) => void;
  'new-ice-candidate': (payload: IWebRTCPayload) => void;
}

export interface IClientEventsType {
  join_room: (roomId: string) => void;
  'video-offer': (payload: IWebRTCPayload) => void;
  'video-answer': (payload: IWebRTCPayload) => void;
  'new-ice-candidate': (payload: IWebRTCPayload) => void;
}

export interface ISignalingSocket extends Socket<IServerEventsType, IClientEventsType> {}
