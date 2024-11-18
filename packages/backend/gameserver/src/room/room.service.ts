import { Injectable } from '@nestjs/common';

interface Room {
  gsid: string;
  hostUserId: string;
  userIds: Set<string>;
  readyUserIds: Set<string>;
}

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  // 게임방 생성
  async createRoom(hostUserId: string): Promise<string> {
    const gsid = `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newRoom: Room = {
      gsid,
      hostUserId,
      userIds: new Set([hostUserId]),
      readyUserIds: new Set(),
    };
    this.rooms.set(gsid, newRoom);
    return gsid;
  }

  // 게임방 참가
  async joinRoom(gsid: string, userId: string): Promise<Room> {
    const room = this.rooms.get(gsid);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    room.userIds.add(userId);
    return room;
  }

  // 게임방 나가기
  async leaveRoom(gsid: string, userId: string): Promise<void> {
    const room = this.rooms.get(gsid);
    if (room) {
      room.userIds.delete(userId);
      room.readyUserIds.delete(userId);
      // 방에 유저가 없으면 방 삭제
      if (room.userIds.size === 0) {
        this.rooms.delete(gsid);
      } else if (room.hostUserId === userId) {
        // 방장이 나가면 새로운 방장 지정
        room.hostUserId = Array.from(room.userIds)[0];
      }
    }
  }

  // 방 정보 가져오기
  async getRoomInfo(gsid: string): Promise<Room> {
    const room = this.rooms.get(gsid);
    if (!room) {
      throw new Error('방을 찾을 수 없습니다.');
    }
    return room;
  }

  // 현재 방장의 유저 ID 가져오기
  async getHostUserId(gsid: string): Promise<string | null> {
    const room = this.rooms.get(gsid);
    return room ? room.hostUserId : null;
  }
}
