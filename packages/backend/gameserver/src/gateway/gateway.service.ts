import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';
import { IGameInfo } from '../game/types/game.types';
import {
  Iuser_left,
  Ijoin_room_success,
  Iupdate_ready,
  Iuser_joined,
  Icreate_room_success,
  Ireceive_message,
} from '../room/types/room.types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GatewayService {
  private readonly MAX_ROOM_SIZE = 6;

  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) {}

  validateConnection(userId: string, password: string): boolean {
    return this.authService.isValidGuest(userId, password);
  }

  handleDisconnection(gsid: string, userId: string): Iuser_left | null {
    if (!gsid) return null;
    return this.roomService.leaveRoom(gsid, userId);
  }

  handleLeaveRoom(gsid: string, userId: string): Iuser_left | null {
    return this.roomService.leaveRoom(gsid, userId);
  }

  createRoom(userId: string): Icreate_room_success {
    const gsid = this.roomService.createRoom(userId);
    return { gsid, isHost: true };
  }

  joinRoom(
    gsid: string,
    userId: string,
  ): {
    joinRoomData: Ijoin_room_success;
    userJoinedData: Iuser_joined;
  } {
    const room = this.roomService.getRoom(gsid);
    if (!room) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (room.userIds.size >= this.MAX_ROOM_SIZE) {
      throw new WsException('방이 가득 찼습니다.');
    }

    return this.roomService.joinRoom(gsid, userId);
  }

  createMessage(userId: string, message: string): Ireceive_message {
    return this.roomService.createMessage(userId, message);
  }

  handleReady(gsid: string, userId: string, isReady: boolean): Iupdate_ready {
    return this.roomService.handleReady(gsid, userId, isReady);
  }

  startGame(gsid: string, userId: string): IGameInfo {
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

    const gameState = this.gameService.startGame(gsid);
    return {
      ...gameState,
      gsid,
    };
  }

  handleSpeakingEnd(gsid: string, userId: string): void {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.speakerQueue[0] !== userId) {
      throw new Error('현재 발언 차례가 아닙니다.');
    }

    this.gameService.endSpeaking(gsid);
  }

  submitVote(gsid: string, voterId: string, targetId: string): void {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    this.gameService.submitVote(gsid, voterId, targetId);
  }

  processVoteResult(gsid: string) {
    return this.gameService.processVoteResult(gsid);
  }

  submitGuess(gsid: string, userId: string, word: string): boolean {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.pinocoId !== userId) {
      throw new Error('피노코만 단어를 추측할 수 있습니다.');
    }

    return this.gameService.submitGuess(gsid, word);
  }
}
