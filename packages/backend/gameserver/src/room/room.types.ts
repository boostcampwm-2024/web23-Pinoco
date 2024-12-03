export interface IRoomInfo {
  gsid: string;
  userIds: Set<string>;
  readyUserIds: Set<string>;
  hostUserId: string;
  isPlaying: boolean;
}

export interface Icreate_room_success {
  gsid: string;
  isHost: true;
}

export interface Ijoin_room_success {
  userIds: string[];
  readyUserIds: string[];
  isHost: boolean;
  hostUserId: string;
}

export interface Iuser_left {
  userId: string;
  hostUserId: string;
}

export interface Iuser_joined {
  userId: string;
}

export interface Iupdate_ready {
  readyUserIds: string[];
}
