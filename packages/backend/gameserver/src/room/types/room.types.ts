export interface IRoomInfo {
  gsid: string;
  userIds: Set<string>;
  readyUserIds: Set<string>;
  hostUserId: string;
  isPlaying: boolean;
}

export interface IRoomEventPayload {
  userId: string;
  hostUserId: string;
}

export interface IJoinRoomResponse {
  userIds: string[];
  readyUserIds: string[];
  isHost: boolean;
  hostUserId: string;
}
