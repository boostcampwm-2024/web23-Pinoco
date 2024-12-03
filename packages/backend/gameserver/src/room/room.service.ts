import { Injectable } from '@nestjs/common';
import { IRoomInfo, IJoinRoomResponse } from './types/room.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomService {
  private rooms: Map<string, IRoomInfo> = new Map();
  private MAX_ROOM_SIZE = 6;

  createRoom(userId: string): string {
    let gsid: string;
    do {
      gsid = uuidv4().substring(0, 4);
    } while (this.rooms.has(gsid));

    const roomInfo: IRoomInfo = {
      gsid,
      userIds: new Set([userId]),
      readyUserIds: new Set(),
      hostUserId: userId,
      isPlaying: false,
    };

    this.rooms.set(gsid, roomInfo);
    return gsid;
  }

  joinRoom(gsid: string, userId: string): IJoinRoomResponse {
    const room = this.rooms.get(gsid);
    if (!room) {
      throw new Error('존재하지 않는 방입니다.');
    }

    if (room.userIds.size >= this.MAX_ROOM_SIZE) {
      throw new Error('방이 가득 찼습니다.');
    }

    if (room.isPlaying) {
      throw new Error('게임이 진행중입니다.');
    }

    room.userIds.add(userId);

    return {
      userIds: Array.from(room.userIds),
      readyUserIds: Array.from(room.readyUserIds),
      isHost: room.hostUserId === userId,
      hostUserId: room.hostUserId,
    };
  }

  leaveRoom(gsid: string, userId: string): string | null {
    const room = this.rooms.get(gsid);
    if (!room) return null;

    room.userIds.delete(userId);
    room.readyUserIds.delete(userId);

    if (room.userIds.size === 0) {
      this.rooms.delete(gsid);
      return null;
    }

    if (room.hostUserId === userId) {
      const newHost = Array.from(room.userIds)[0];
      room.hostUserId = newHost;
      return newHost;
    }

    return room.hostUserId;
  }

  getRoom(gsid: string): IRoomInfo | undefined {
    return this.rooms.get(gsid);
  }
}
