import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private rooms: Map<string, string[]> = new Map();

  joinRoom(roomId: string, userId: string): string {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
    }
    const users = this.rooms.get(roomId);
    users.push(userId);
    return `User ${userId} joined room ${roomId}`;
  }

  getRoomUsers(roomId: string): string[] {
    return this.rooms.get(roomId) || [];
  }
}
