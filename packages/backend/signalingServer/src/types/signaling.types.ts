import { Socket } from 'socket.io';

export interface IWebRTCPayload {
  ssid: string;
  userID?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  from?: string;
}

export interface IServerEventsType {
  video_offer?: (payload: IWebRTCPayload) => void;
  video_answer?: (payload: IWebRTCPayload) => void;
  new_ice_candidate?: (payload: IWebRTCPayload) => void;
}

export interface IClientEventsType {
  video_offer?: (payload: IWebRTCPayload) => void;
  video_answer?: (payload: IWebRTCPayload) => void;
  new_ice_candidate?: (payload: IWebRTCPayload) => void;
}

export interface ISignalingSocket extends Socket<IServerEventsType, IClientEventsType> {}
