export interface RoomInfo {
  gsid: string;
  userIds: Set<string>;
  readyUserIds: Set<string>;
  hostUserId: string;
}

export interface RoomEventPayload {
  userId: string;
  hostUserId?: string;
}

export interface JoinRoomResponse {
  userIds: string[];
  readyUserIds: string[];
  isHost: boolean;
  hostUserId: string;
}
