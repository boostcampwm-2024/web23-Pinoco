import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { IGameInfo } from '../game/types/game.types';
import { IRoomEventPayload, IJoinRoomResponse } from '../room/types/room.types';
import { CreateRoomResponse } from '../types/socket.types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GatewayService {
  private readonly MAX_ROOM_SIZE = 6;

  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
    private readonly gameService: GameService,
  ) {}

  async validateConnection(userId: string, password: string): Promise<boolean> {
    return this.authService.isValidGuest(userId, password);
  }

  async handleDisconnection(
    gsid: string,
    userId: string,
  ): Promise<IRoomEventPayload | null> {
    if (!gsid) return null;

    const newHostId = await this.roomService.leaveRoom(gsid, userId);
    return newHostId ? { userId, hostUserId: newHostId } : null;
  }

  async handleLeaveRoom(
    gsid: string,
    userId: string,
  ): Promise<IRoomEventPayload | null> {
    const newHostId = await this.roomService.leaveRoom(gsid, userId);
    return newHostId ? { userId, hostUserId: newHostId } : null;
  }

  async createRoom(userId: string): Promise<CreateRoomResponse> {
    const gsid = await this.roomService.createRoom(userId);
    return { gsid, isHost: true };
  }

  async joinRoom(gsid: string, userId: string): Promise<IJoinRoomResponse> {
    const room = this.roomService.getRoom(gsid);
    if (!room) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (room.userIds.size >= this.MAX_ROOM_SIZE) {
      throw new WsException('방이 가득 찼습니다.');
    }

    return await this.roomService.joinRoom(gsid, userId);
  }

  async saveMessage(
    gsid: string,
    userId: string,
    message: string,
  ): Promise<void> {
    await this.chatService.saveMessage(gsid, userId, message);
  }

  async handleReady(
    gsid: string,
    userId: string,
    isReady: boolean,
  ): Promise<string[]> {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    if (isReady) {
      room.readyUserIds.add(userId);
    } else {
      room.readyUserIds.delete(userId);
    }

    return Array.from(room.readyUserIds);
  }

  async startGame(gsid: string, userId: string): Promise<IGameInfo> {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    if (room.hostUserId !== userId) {
      throw new Error('방장만 게임을 시작할 수 있습니다.');
    }

    if (room.userIds.size < 3) {
      throw new Error('게임을 시작하려면 최소 3명의 플레이어가 필요합니다.');
    }

    if (room.readyUserIds.size !== room.userIds.size - 1) {
      throw new Error('모든 참가자가 준비되어야 합니다.');
    }

    const gameState = await this.gameService.startGame(gsid);

    return {
      ...gameState,
      gsid,
    };
  }

  async handleSpeakingEnd(gsid: string, userId: string): Promise<void> {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.speakerQueue[0] !== userId) {
      throw new Error('현재 발언 차례가 아닙니다.');
    }

    await this.gameService.endSpeaking(gsid);
  }

  async submitVote(
    gsid: string,
    voterId: string,
    targetId: string,
  ): Promise<void> {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    await this.gameService.submitVote(gsid, voterId, targetId);
  }

  async processVoteResult(gsid: string) {
    return await this.gameService.processVoteResult(gsid);
  }

  async submitGuess(
    gsid: string,
    userId: string,
    word: string,
  ): Promise<boolean> {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.pinocoId !== userId) {
      throw new Error('피노코만 단어를 추측할 수 있습니다.');
    }

    return await this.gameService.submitGuess(gsid, word);
  }
}
