import { Injectable } from '@nestjs/common';
import { IRoomInfo } from './types/room.types';
import { v4 as uuidv4 } from 'uuid';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RoomService {
  private rooms: Map<string, IRoomInfo> = new Map();
  private readonly MAX_ROOM_SIZE = 6;

  createRoom(userId: string): IRoomInfo {
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
    return roomInfo;
  }

  joinRoom(userId: string, gsid: string, client: any): IRoomInfo {
    const room = this.getRoom(gsid);
    if (!room) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (room.userIds.size >= this.MAX_ROOM_SIZE) {
      throw new WsException('방이 가득 찼습니다.');
    }

    if (room.isPlaying) {
      throw new WsException('게임이 진행중입니다.');
    }

    room.userIds.add(userId);
    client.join(gsid);
    client.data.gsid = gsid;

    return room;
  }

  leaveRoom(userId: string, gsid: string, client: any): IRoomInfo | null {
    const room = this.getRoom(gsid);
    if (!room) return null;

    room.userIds.delete(userId);
    room.readyUserIds.delete(userId);

    if (client) {
      client.leave(gsid);
      client.data.gsid = null;
    }

    if (room.userIds.size === 0) {
      this.rooms.delete(gsid);
      return null;
    }

    if (room.hostUserId === userId) {
      room.hostUserId = Array.from(room.userIds)[0];
    }

    return room;
  }

  handleReady(
    gsid: string,
    userId: string,
    isReady: boolean,
    server: any,
  ): IRoomInfo {
    const room = this.getRoom(gsid);
    if (!room) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (room.hostUserId === userId) {
      throw new WsException('방장은 준비할 수 없습니다.');
    }

    if (isReady) {
      room.readyUserIds.add(userId);
    } else {
      room.readyUserIds.delete(userId);
    }

    server.to(gsid).emit('update_ready', {
      readyUsers: Array.from(room.readyUserIds),
    });

    return room;
  }

  createMessage(
    userId: string,
    message: string,
    gsid: string,
    server: any,
  ): IRoomInfo {
    const room = this.getRoom(gsid);
    if (!room) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (!room.userIds.has(userId)) {
      throw new WsException('방에 참여하지 않은 사용자입니다.');
    }

    server.to(gsid).emit('receive_message', {
      userId,
      message,
      timestamp: Date.now(),
    });

    return room;
  }

  getRoom(gsid: string): IRoomInfo | undefined {
    return this.rooms.get(gsid);
  }
}
