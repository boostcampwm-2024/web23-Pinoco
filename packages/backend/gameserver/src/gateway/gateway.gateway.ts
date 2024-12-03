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
import { AuthenticatedSocket } from '../types/socket.types';
import {
  Iuser_left,
  Ijoin_room_success,
  Ireceive_message,
} from '../room/types/room.types';
import { LoggerService } from '../logger/logger.service';
import { GameService } from '../game/game.service';
import { RoomService } from '../room/room.service';
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptionFilter } from '../filters/ws-exception.filter';
import { WsException } from '@nestjs/websockets';

@WebSocketGateway()
@UseFilters(WebSocketExceptionFilter)
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly gameService: GameService,
    private readonly roomService: RoomService,
  ) {}

  handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.handshake.query.userId as string;
    const password = client.handshake.query.password as string;

    const isValid = this.gatewayService.validateConnection(userId, password);
    if (!isValid) {
      client.disconnect();
      throw new WsException('인증에 실패했습니다.');
    }

    client.data.userId = userId;
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;

    const result = this.gatewayService.handleDisconnection(gsid, userId);
    if (result) {
      this.emitUserLeft(gsid, result);
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    const result = this.gatewayService.handleLeaveRoom(gsid, userId);
    if (result) {
      this.emitUserLeft(gsid, result);
    }
    this.handleRoomLeave(client);
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.data.userId;
    const result = this.gatewayService.createRoom(userId);
    this.handleRoomJoin(client, result.gsid);
    client.emit('create_room_success', result);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const roomInfo = this.gatewayService.joinRoom(
      data.gsid,
      client.data.userId,
    );
    this.handleRoomJoin(client, data.gsid);

    client.emit('join_room_success', roomInfo);
    this.emitUserJoined(data.gsid, client.data.userId);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;

    if (!gsid) {
      throw new WsException('방에 참여되어 있지 않습니다.');
    }

    const payload = this.gatewayService.createMessage(userId, data.message);
    this.server.to(gsid).emit('receive_message', payload);
  }

  @SubscribeMessage('send_ready')
  handleReady(
    @MessageBody() data: { isReady: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;

    try {
      const readyUsers = this.gatewayService.handleReady(
        gsid,
        userId,
        data.isReady,
      );
      console.log(readyUsers);
      this.server.to(gsid).emit('update_ready', readyUsers);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('start_game')
  handleStartGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;

    try {
      const gameState = this.gatewayService.startGame(gsid, userId);

      const room = this.roomService.getRoom(gsid);
      room.userIds.forEach((uid) => {
        const isPinoco = gameState.pinocoId === uid;
        const personalGameState = {
          isPinoco,
          theme: gameState.theme,
          word: isPinoco ? '' : gameState.word,
          speakerId: gameState.speakerQueue[0],
          allUserIds: gameState.userIds,
        };
        room.isPlaying = true;

        this.server
          .to(this.getSocketIdByUserId(uid))
          .emit('start_game_success', personalGameState);
      });
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('end_speaking')
  handleEndSpeaking(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;

    try {
      this.gatewayService.handleSpeakingEnd(gsid, userId);
      const gameState = this.gameService.getGameState(gsid);

      if (gameState.phase === 'VOTING') {
        this.server.to(gsid).emit('start_vote');
      } else {
        this.server.to(gsid).emit('start_speaking', {
          speakerId: gameState.speakerQueue[0],
        });
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('vote_pinoco')
  handleVote(
    @MessageBody() data: { voteUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;

    try {
      this.gatewayService.submitVote(gsid, userId, data.voteUserId);
      let gameState = this.gameService.getGameState(gsid);
      const room = this.roomService.getRoom(gsid);

      if (
        Object.keys(gameState.votes).length === gameState.liveUserIds.length
      ) {
        const result = this.gatewayService.processVoteResult(gsid);
        this.server.to(gsid).emit('receive_vote_result', result);

        gameState = this.gameService.getGameState(gsid);
        if (gameState.phase === 'GUESSING') {
          setTimeout(() => {
            this.server.to(gsid).emit('start_guessing', {
              guessingUserId: gameState.pinocoId,
            });
          }, 3000);
        } else if (gameState.phase === 'SPEAKING') {
          const nextSpeaker = gameState.speakerQueue[0];
          setTimeout(() => {
            this.server.to(gsid).emit('start_speaking', {
              speakerId: nextSpeaker,
            });
          }, 3000);
        } else if (gameState.phase === 'ENDING') {
          setTimeout(() => {
            this.server.to(gsid).emit('start_ending', {
              isPinocoWin: true,
              pinoco: gameState.pinocoId,
              isGuessed: false,
              guessingWord: '',
            });

            this.gameService.endGame(gsid);
            const room = this.roomService.getRoom(gsid);
            room.readyUserIds.clear();
            room.isPlaying = false;
          }, 3000);
        }
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  @SubscribeMessage('send_guessing')
  handleGuessing(
    @MessageBody() data: { guessingWord: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;

    try {
      const isCorrect = this.gatewayService.submitGuess(
        gsid,
        userId,
        data.guessingWord,
      );

      const gameState = this.gameService.getGameState(gsid);

      this.server.to(gsid).emit('start_ending', {
        isPinocoWin: isCorrect,
        pinoco: gameState.pinocoId,
        isGuessed: true,
        guessingWord: data.guessingWord,
      });

      this.gameService.endGame(gsid);
      const room = this.roomService.getRoom(gsid);
      room.readyUserIds.clear();
      room.isPlaying = false;
    } catch (error) {
      throw new WsException(error.message);
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

  private emitUserLeft(gsid: string, payload: Iuser_left): void {
    this.server.to(gsid).emit('user_left', payload);
  }

  private emitUserJoined(gsid: string, userId: string): void {
    this.server.to(gsid).emit('user_joined', { userId });
  }

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
