import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    gsid?: string;
  };
}

export interface CreateRoomResponse {
  gsid: string;
  isHost: boolean;
}

export interface SendMessagePayload {
  userId: string;
  message: string;
}

export interface ErrorResponse {
  errorMessage: string;
}
