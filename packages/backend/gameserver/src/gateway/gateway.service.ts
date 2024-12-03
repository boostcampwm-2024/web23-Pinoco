import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';
import { IGameInfo, IGameState } from '../game/types/game.types';
import {
  Iuser_left,
  Ijoin_room_success,
  Iupdate_ready,
  Iuser_joined,
  Icreate_room_success,
  Ireceive_message,
  IRoomInfo,
} from '../room/types/room.types';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket.types';

@Injectable()
export class GatewayService {
  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) {}

  validateConnection(userId: string, password: string): boolean {
    return this.authService.isValidGuest(userId, password);
  }

  handleDisconnection(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left {
    const room = this.roomService.leaveRoom(userId, gsid, client);
    return {
      userId,
      hostUserId: room.hostUserId,
    };
  }

  handleLeaveRoom(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left {
    const room = this.roomService.leaveRoom(userId, gsid, client);
    return {
      userId,
      hostUserId: room.hostUserId,
    };
  }

  createRoom(userId: string): Icreate_room_success {
    const room = this.roomService.createRoom(userId);
    return {
      gsid: room.gsid,
      isHost: true,
    };
  }

  joinRoom(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): {
    joinRoomData: Ijoin_room_success;
    userJoinedData: Iuser_joined;
  } {
    const room = this.roomService.joinRoom(userId, gsid, client);

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

  createMessage(
    gsid: string,
    userId: string,
    message: string,
    server: Server,
  ): Ireceive_message {
    this.roomService.createMessage(userId, message, gsid, server);
    return {
      userId,
      message,
      timestamp: Date.now(),
    };
  }

  handleReady(
    gsid: string,
    userId: string,
    isReady: boolean,
    server: Server,
  ): Iupdate_ready {
    const room = this.roomService.handleReady(gsid, userId, isReady, server);
    return {
      readyUsers: Array.from(room.readyUserIds),
    };
  }

  getRoomInfo(gsid: string): IRoomInfo {
    return this.roomService.getRoom(gsid);
  }

  getGameState(gsid: string): IGameState {
    return this.gameService.getGameState(gsid);
  }

  startGame(gsid: string, userId: string, server: Server): IGameInfo {
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
    room.isPlaying = true;

    room.userIds.forEach((uid) => {
      const isPinoco = gameState.pinocoId === uid;
      const personalGameState = {
        isPinoco,
        theme: gameState.theme,
        word: isPinoco ? '' : gameState.word,
        speakerId: gameState.speakerQueue[0],
        allUserIds: gameState.userIds,
      };

      const sockets = server.sockets.sockets;
      for (const [, socket] of sockets.entries()) {
        if ((socket as AuthenticatedSocket).data.userId === uid) {
          socket.emit('start_game_success', personalGameState);
          break;
        }
      }
    });

    return {
      ...gameState,
      gsid,
    };
  }

  handleSpeakingEnd(gsid: string, userId: string, server: Server): void {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.speakerQueue[0] !== userId) {
      throw new Error('현재 발언 차례가 아닙니다.');
    }

    this.gameService.endSpeaking(gsid);
    const newGameState = this.gameService.getGameState(gsid);

    if (newGameState.phase === 'VOTING') {
      server.to(gsid).emit('start_vote');
    } else {
      server.to(gsid).emit('start_speaking', {
        speakerId: newGameState.speakerQueue[0],
      });
    }
  }

  submitVote(
    gsid: string,
    voterId: string,
    targetId: string,
    server: Server,
  ): void {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    this.gameService.submitVote(gsid, voterId, targetId);
    let gameState = this.gameService.getGameState(gsid);

    if (Object.keys(gameState.votes).length === gameState.liveUserIds.length) {
      const result = this.gameService.processVoteResult(gsid);
      server.to(gsid).emit('receive_vote_result', result);

      gameState = this.gameService.getGameState(gsid);
      if (gameState.phase === 'GUESSING') {
        setTimeout(() => {
          server.to(gsid).emit('start_guessing', {
            guessingUserId: gameState.pinocoId,
          });
        }, 3000);
      } else if (gameState.phase === 'SPEAKING') {
        setTimeout(() => {
          server.to(gsid).emit('start_speaking', {
            speakerId: gameState.speakerQueue[0],
          });
        }, 3000);
      } else if (gameState.phase === 'ENDING') {
        setTimeout(() => {
          server.to(gsid).emit('start_ending', {
            isPinocoWin: true,
            pinoco: gameState.pinocoId,
            isGuessed: false,
            guessingWord: '',
          });
          this.endGame(gsid);
        }, 3000);
      }
    }
  }

  submitGuess(
    gsid: string,
    userId: string,
    word: string,
    server: Server,
  ): boolean {
    const game = this.gameService.getGameState(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (game.pinocoId !== userId) {
      throw new Error('피노코만 단어를 추측할 수 있습니다.');
    }

    const isCorrect = this.gameService.submitGuess(gsid, word);
    server.to(gsid).emit('start_ending', {
      isPinocoWin: isCorrect,
      pinoco: game.pinocoId,
      isGuessed: true,
      guessingWord: word,
    });

    this.endGame(gsid);
    return isCorrect;
  }

  endGame(gsid: string): void {
    this.gameService.endGame(gsid);
    const room = this.roomService.getRoom(gsid);
    if (room) {
      room.readyUserIds.clear();
      room.isPlaying = false;
    }
  }
}
