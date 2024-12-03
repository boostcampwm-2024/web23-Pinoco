import { Injectable } from '@nestjs/common';
import {
  IRoomInfo,
  Ijoin_room_success,
  Iuser_left,
  Iupdate_ready,
  Iuser_joined,
} from './room.types';
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

  joinRoom(
    gsid: string,
    userId: string,
  ): { joinRoomData: Ijoin_room_success; userJoinedData: Iuser_joined } {
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
      joinRoomData: {
        userIds: Array.from(room.userIds),
        readyUserIds: Array.from(room.readyUserIds),
        isHost: room.hostUserId === userId,
        hostUserId: room.hostUserId,
      },
      userJoinedData: {
        userId,
      },
    };
  }

  leaveRoom(gsid: string, userId: string): Iuser_left | null {
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
      return {
        userId,
        hostUserId: newHost,
      };
    }

    return {
      userId,
      hostUserId: room.hostUserId,
    };
  }

  handleReady(gsid: string, userId: string, isReady: boolean): Iupdate_ready {
    const room = this.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    if (isReady) {
      room.readyUserIds.add(userId);
    } else {
      room.readyUserIds.delete(userId);
    }

    return {
      readyUserIds: Array.from(room.readyUserIds),
    };
  }

  getRoom(gsid: string): IRoomInfo | undefined {
    return this.rooms.get(gsid);
  }
}
