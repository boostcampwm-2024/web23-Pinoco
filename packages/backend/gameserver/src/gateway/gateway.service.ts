import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { ChatService } from '../chat/chat.service';
import { RoomEventPayload, JoinRoomResponse } from '../room/types/room.types';
import { CreateRoomResponse } from '../types/socket.types';

@Injectable()
export class GatewayService {
  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
  ) {}

  async validateConnection(userId: string, password: string): Promise<boolean> {
    return this.authService.isValidGuest(userId, password);
  }

  async handleDisconnection(
    gsid: string,
    userId: string,
  ): Promise<RoomEventPayload | null> {
    if (!gsid) return null;

    const newHostId = await this.roomService.leaveRoom(gsid, userId);
    return newHostId ? { userId, hostUserId: newHostId } : null;
  }

  async handleLeaveRoom(
    gsid: string,
    userId: string,
  ): Promise<RoomEventPayload | null> {
    const newHostId = await this.roomService.leaveRoom(gsid, userId);
    return newHostId ? { userId, hostUserId: newHostId } : null;
  }

  async createRoom(userId: string): Promise<CreateRoomResponse> {
    const gsid = await this.roomService.createRoom(userId);
    return { gsid, isHost: true };
  }

  async joinRoom(gsid: string, userId: string): Promise<JoinRoomResponse> {
    return await this.roomService.joinRoom(gsid, userId);
  }

  async saveMessage(
    gsid: string,
    userId: string,
    message: string,
  ): Promise<void> {
    await this.chatService.saveMessage(gsid, userId, message);
  }
}
