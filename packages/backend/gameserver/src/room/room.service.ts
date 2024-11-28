import { Injectable } from '@nestjs/common';
import { IRoomInfo, IJoinRoomResponse } from './types/room.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomService {
  private rooms: Map<string, IRoomInfo> = new Map();
  private MAX_ROOM_SIZE = 6;

  async createRoom(userId: string): Promise<string> {
    let gsid: string;
    do {
      gsid = uuidv4().substring(0, 4);
    } while (this.rooms.has(gsid));

    const roomInfo: IRoomInfo = {
      gsid,
      userIds: new Set([userId]),
      readyUserIds: new Set(),
      hostUserId: userId,
    };

    this.rooms.set(gsid, roomInfo);
    return gsid;
  }

  async joinRoom(gsid: string, userId: string): Promise<IJoinRoomResponse> {
    const room = this.rooms.get(gsid);
    if (!room) {
      throw new Error('존재하지 않는 방입니다.');
    }

    if (room.userIds.size > this.MAX_ROOM_SIZE) {
      throw new Error('방이 가득 찼습니다.');
    }

    room.userIds.add(userId);

    return {
      userIds: Array.from(room.userIds),
      readyUserIds: Array.from(room.readyUserIds),
      isHost: room.hostUserId === userId,
      hostUserId: room.hostUserId,
    };
  }

  async leaveRoom(gsid: string, userId: string): Promise<string | null> {
    const room = this.rooms.get(gsid);
    if (!room) return null;

    room.userIds.delete(userId);
    room.readyUserIds.delete(userId);

    // 방에 아무도 없으면 방 삭제
    if (room.userIds.size === 0) {
      this.rooms.delete(gsid);
      return null;
    }

    // 호스트가 나간 경우 새로운 호스트 지정
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
