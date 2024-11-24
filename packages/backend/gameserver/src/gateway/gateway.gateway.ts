import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';
import {
  AuthenticatedSocket,
  SendMessagePayload,
  ErrorResponse,
} from '../types/socket.types';
import { IRoomEventPayload, IJoinRoomResponse } from '../room/types/room.types';
import { LoggerService } from '../logger/logger.service';
import { GameService } from '../game/game.service';
import { RoomService } from '../room/room.service';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly logger: LoggerService,
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
  ) {}

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.handshake.query.userId as string;
    const password = client.handshake.query.password as string;

    this.logger.logSocketEvent('receive', 'connection', { userId });

    const isValid = await this.gatewayService.validateConnection(
      userId,
      password,
    );
    if (!isValid) {
      this.logger.logSocketEvent('send', 'connection_failed', { userId });
      this.emitError(client, '인증에 실패했습니다.');
      client.disconnect();
      return;
    }

    client.data.userId = userId;
    this.logger.logSocketEvent('send', 'connection_success', { userId });
  }

  async handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'disconnect', { userId, gsid });

    const result = await this.gatewayService.handleDisconnection(gsid, userId);
    if (result) {
      this.logger.logSocketEvent('send', 'user_left', {
        gsid,
        userId,
        newHostId: result.hostUserId,
      });
      this.emitUserLeft(gsid, result);
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'leave_room', { userId, gsid });

    try {
      const result = await this.gatewayService.handleLeaveRoom(gsid, userId);
      if (result) {
        this.logger.logSocketEvent('send', 'user_left', {
          gsid,
          userId,
          newHostId: result.hostUserId,
        });
        this.emitUserLeft(gsid, result);
      }
      this.handleRoomLeave(client);
      this.logger.logSocketEvent('send', 'leave_room_success', {
        userId,
        gsid,
      });
    } catch (error) {
      this.logger.logError('leave_room_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.data.userId;
    this.logger.logSocketEvent('receive', 'create_room', { userId });

    try {
      const result = await this.gatewayService.createRoom(userId);
      this.handleRoomJoin(client, result.gsid);
      this.logger.logSocketEvent('send', 'create_room_success', {
        userId,
        gsid: result.gsid,
      });
      client.emit('create_room_success', result);
    } catch (error) {
      this.logger.logError('create_room_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.data.userId;
    this.logger.logSocketEvent('receive', 'join_room', {
      userId,
      gsid: data.gsid,
    });

    try {
      const roomInfo = await this.gatewayService.joinRoom(
        data.gsid,
        client.data.userId,
      );
      this.handleRoomJoin(client, data.gsid);

      this.logger.logSocketEvent('send', 'join_room_success', {
        userId,
        gsid: data.gsid,
        roomInfo,
      });
      client.emit('join_room_success', roomInfo);

      this.logger.logSocketEvent('send', 'user_joined', {
        gsid: data.gsid,
        userId: client.data.userId,
      });
      this.emitUserJoined(data.gsid, client.data.userId);
    } catch (error) {
      this.logger.logError('join_room_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'send_message', {
      userId,
      gsid,
      message: data.message,
    });

    if (!gsid) {
      this.logger.logSocketEvent('send', 'error', {
        userId,
        reason: 'not_in_room',
      });
      this.emitError(client, '방에 참여되어 있지 않습니다.');
      return;
    }

    try {
      await this.gatewayService.saveMessage(gsid, userId, data.message);

      this.logger.logSocketEvent('send', 'receive_message', {
        gsid,
        userId,
        message: data.message,
      });
      this.emitMessage(gsid, { userId, message: data.message });
    } catch (error) {
      this.logger.logError('send_message_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('send_ready')
  async handleReady(
    @MessageBody() data: { isReady: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'send_ready', {
      userId,
      gsid,
      isReady: data.isReady,
    });

    try {
      const readyUsers = await this.gatewayService.handleReady(
        gsid,
        userId,
        data.isReady,
      );
      this.logger.logSocketEvent('send', 'update_ready', { gsid, readyUsers });
      this.server.to(gsid).emit('update_ready', { readyUsers });
    } catch (error) {
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('start_game')
  async handleStartGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'start_game', { userId, gsid });

    try {
      const gameState = await this.gatewayService.startGame(gsid, userId);
      console.log(gameState);

      const room = this.roomService.getRoom(gsid);
      room.userIds.forEach((uid) => {
        const isPinoco = gameState.pinocoId === uid;
        const personalGameState = {
          isPinoco,
          word: isPinoco ? '' : gameState.word,
          speakerId: gameState.currentSpeakerId,
        };

        this.logger.logSocketEvent('send', 'start_game_success', {
          personalGameState,
        });
        this.server
          .to(this.getSocketIdByUserId(uid))
          .emit('start_game_success', personalGameState);
      });

      // setTimeout(async () => {
      //   await this.gatewayService.handleSpeakingEnd(gsid, userId);
      //   const gameState = this.gameService.getGameState(gsid);
      //   console.log(gameState.currentSpeakerId);
      //   this.logger.logSocketEvent('send', 'start_speaking', {
      //     speakerId: gameState.currentSpeakerId,
      //   });
      //   this.server.to(gsid).emit('start_speaking', {
      //     speakerId: gameState.currentSpeakerId,
      //   });
      // }, 3000);
    } catch (error) {
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('end_speaking')
  async handleEndSpeaking(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'end_speaking', { userId, gsid });

    try {
      const isAllSpoken = await this.gatewayService.handleSpeakingEnd(
        gsid,
        userId,
      );
      const gameState = this.gameService.getGameState(gsid);
      console.log('Game state after speaking end:', {
        phase: gameState.phase,
        isAllSpoken,
        spokenUsers: Array.from(gameState.spokenUsers),
        totalUsers: this.roomService.getRoom(gsid)?.userIds.size,
      });

      if (isAllSpoken) {
        console.log('모든 사용자가 발언을 마쳤습니다. 투표를 시작합니다.');
        this.logger.logSocketEvent('send', 'start_vote', { gsid });
        // 룸의 모든 소켓에 직접 이벤트 전송
        const sockets = await this.server.in(gsid).fetchSockets();
        sockets.forEach((socket) => {
          socket.emit('start_vote');
        });
      } else {
        this.logger.logSocketEvent('send', 'start_speaking', {
          gsid,
          speakerId: gameState.currentSpeakerId,
          spokenUsers: Array.from(gameState.spokenUsers),
        });
        this.server.to(gsid).emit('start_speaking', {
          speakerId: gameState.currentSpeakerId,
        });
      }
    } catch (error) {
      this.logger.logError('end_speaking_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('vote_pinoco')
  async handleVote(
    @MessageBody() data: { voteUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'vote_pinoco', {
      userId,
      gsid,
      targetId: data.voteUserId,
    });

    try {
      await this.gatewayService.submitVote(gsid, userId, data.voteUserId);
      const gameState = this.gameService.getGameState(gsid);
      const room = await this.roomService.getRoom(gsid);

      if (Object.keys(gameState.votes).length === room.userIds.size) {
        const result = await this.gatewayService.processVoteResult(gsid);

        this.logger.logSocketEvent('send', 'receive_vote_result', {
          gsid,
          result,
        });
        this.server.to(gsid).emit('receive_vote_result', result);

        if (result.deadPerson === gameState.pinocoId) {
          this.logger.logSocketEvent('send', 'start_guessing', {
            gsid,
            guessingUserId: gameState.pinocoId,
          });
          this.server.to(gsid).emit('start_guessing', {
            guessingUserId: gameState.pinocoId,
          });
        } else {
          // 다음 라운드 시작
          const nextSpeaker = gameState.currentSpeakerId;
          this.logger.logSocketEvent('send', 'start_speaking', {
            gsid,
            speakerId: nextSpeaker,
          });
          this.server.to(gsid).emit('start_speaking', {
            speakerId: nextSpeaker,
          });
        }
      }
    } catch (error) {
      this.logger.logError('vote_error', error);
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('send_guessing')
  async handleGuessing(
    @MessageBody() data: { guessingWord: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'send_guessing', {
      userId,
      gsid,
      word: data.guessingWord,
    });

    try {
      const isCorrect = await this.gatewayService.submitGuess(
        gsid,
        userId,
        data.guessingWord,
      );

      const gameState = this.gameService.getGameState(gsid);

      this.logger.logSocketEvent('send', 'start_ending', {
        gsid,
        result: {
          isPinocoWin: isCorrect,
          pinoco: gameState.pinocoId,
          isGuessed: true,
          guessingWord: data.guessingWord,
        },
      });

      this.server.to(gsid).emit('start_ending', {
        isPinocoWin: isCorrect,
        pinoco: gameState.pinocoId,
        isGuessed: true,
        guessingWord: data.guessingWord,
      });

      // 게임 종료 및 초기화
      await this.gameService.endGame(gsid);
      const room = this.roomService.getRoom(gsid);
      if (room) {
        room.readyUserIds.clear();
      }
    } catch (error) {
      this.logger.logError('guessing_error', error);
      this.emitError(client, error.message);
    }
  }

  // Private helper methods
  private handleRoomJoin(client: AuthenticatedSocket, gsid: string): void {
    client.join(gsid);
    client.data.gsid = gsid;
  }

  private handleRoomLeave(client: AuthenticatedSocket): void {
    if (client.data.gsid) {
      client.leave(client.data.gsid);
      client.data.gsid = null;
    }
  }

  private emitUserLeft(gsid: string, payload: IRoomEventPayload): void {
    this.server.to(gsid).emit('user_left', payload);
  }

  private emitUserJoined(gsid: string, userId: string): void {
    this.server.to(gsid).emit('user_joined', { userId });
  }

  private emitMessage(gsid: string, payload: SendMessagePayload): void {
    this.server.to(gsid).emit('receive_message', payload);
  }

  private emitError(client: AuthenticatedSocket, message: string): void {
    this.logger.logSocketEvent('send', 'error', {
      userId: client.data.userId,
      message,
    });
    client.emit('error', { errorMessage: message } as ErrorResponse);
  }

  // Socket ID를 찾기 위한 헬퍼 메소드 추가
  private getSocketIdByUserId(userId: string): string {
    const sockets = this.server.sockets.sockets;
    for (const [socketId, socket] of sockets.entries()) {
      if ((socket as AuthenticatedSocket).data.userId === userId) {
        return socketId;
      }
    }
    return null;
  }
}
