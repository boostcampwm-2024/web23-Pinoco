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
import { UseFilters } from '@nestjs/common';
import { WebSocketExceptionFilter } from '../filters/ws-exception.filter';
import { LoggerService } from '../logger/logger.service';

@WebSocketGateway()
@UseFilters(new WebSocketExceptionFilter(new LoggerService()))
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly logger: LoggerService,
  ) {}

  handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const userId = client.handshake.query.userId as string;
      const password = client.handshake.query.password as string;

      const isValid = this.gatewayService.validateConnection(userId, password);
      if (!isValid) {
        this.logger.logSocketEvent('send', 'error', {
          message: '인증에 실패했습니다.',
        });
        client.emit('error', { message: '인증에 실패했습니다.' });
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      this.logger.logSocketEvent('receive', 'connection', { userId });
    } catch (error) {
      this.logger.logError('connection', error);
      client.emit('error', { message: '연결 중 오류가 발생했습니다.' });
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'disconnect', { userId, gsid });
    if (!userId || !gsid) return;

    const result = this.gatewayService.handleDisconnection(
      gsid,
      userId,
      client,
    );
    if (result) {
      this.logger.logSocketEvent('send', 'user_left', result);
      this.server.to(gsid).emit('user_left', result);
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'leave_room', { userId, gsid });
    const result = this.gatewayService.handleLeaveRoom(gsid, userId, client);
    if (result) {
      this.logger.logSocketEvent('send', 'user_left', result);
      this.server.to(gsid).emit('user_left', result);
    }
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.data.userId;
    this.logger.logSocketEvent('receive', 'create_room', { userId });
    const result = this.gatewayService.createRoom(userId);
    this.gatewayService.joinRoom(result.gsid, userId, client);
    this.logger.logSocketEvent('send', 'create_room_success', result);
    client.emit('create_room_success', result);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    this.logger.logSocketEvent('receive', 'join_room', {
      userId: client.data.userId,
      gsid: data.gsid,
    });

    const { joinRoomData, userJoinedData } = this.gatewayService.joinRoom(
      data.gsid,
      client.data.userId,
      client,
    );

    this.logger.logSocketEvent('send', 'join_room_success', joinRoomData);
    client.emit('join_room_success', joinRoomData);
    this.logger.logSocketEvent('send', 'user_joined', userJoinedData);
    this.server.to(data.gsid).emit('user_joined', userJoinedData);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'send_message', {
      userId,
      gsid,
      message: data.message,
    });

    const result = this.gatewayService.createMessage(
      gsid,
      userId,
      data.message,
      this.server,
    );
    this.logger.logSocketEvent('send', 'receive_message', result);
    this.server.to(gsid).emit('receive_message', result);
  }

  @SubscribeMessage('send_ready')
  handleReady(
    @MessageBody() data: { isReady: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;
    this.logger.logSocketEvent('receive', 'send_ready', {
      userId,
      gsid,
      isReady: data.isReady,
    });

    const result = this.gatewayService.handleReady(
      gsid,
      userId,
      data.isReady,
      this.server,
    );
    this.logger.logSocketEvent('send', 'update_ready', result);
    this.server.to(gsid).emit('update_ready', result);
  }

  @SubscribeMessage('start_game')
  handleStartGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'start_game', { userId, gsid });
    const { userSpecificData } = this.gatewayService.startGame(gsid, userId);

    Object.entries(userSpecificData).forEach(([uid, data]) => {
      const sockets = this.server.sockets.sockets;
      for (const [, socket] of sockets.entries()) {
        if ((socket as AuthenticatedSocket).data.userId === uid) {
          this.logger.logSocketEvent('send', 'start_game_success', {
            userId: uid,
            data,
          });
          socket.emit('start_game_success', data);
          break;
        }
      }
    });
  }

  @SubscribeMessage('end_speaking')
  handleEndSpeaking(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'end_speaking', { userId, gsid });
    const { nextPhase, response } = this.gatewayService.handleSpeakingEnd(
      gsid,
      userId,
    );

    if (nextPhase === 'VOTING') {
      this.logger.logSocketEvent('send', 'start_vote', { gsid });
      this.server.to(gsid).emit('start_vote');
    } else {
      this.logger.logSocketEvent('send', 'start_speaking', response);
      this.server.to(gsid).emit('start_speaking', response);
    }
  }

  @SubscribeMessage('vote_pinoco')
  handleVote(
    @MessageBody() data: { voteUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'vote_pinoco', {
      userId,
      gsid,
      voteUserId: data.voteUserId,
    });

    const result = this.gatewayService.submitVote(
      gsid,
      userId,
      data.voteUserId,
    );

    if (result.shouldProcessVote && result.voteResult) {
      const { nextPhase, voteResponse, nextResponse } = result.voteResult;

      this.logger.logSocketEvent('send', 'receive_vote_result', voteResponse);
      this.server.to(gsid).emit('receive_vote_result', voteResponse);

      setTimeout(() => {
        switch (nextPhase) {
          case 'GUESSING':
            this.logger.logSocketEvent('send', 'start_guessing', nextResponse);
            this.server.to(gsid).emit('start_guessing', nextResponse);
            break;
          case 'SPEAKING':
            this.logger.logSocketEvent('send', 'start_speaking', nextResponse);
            this.server.to(gsid).emit('start_speaking', nextResponse);
            break;
          case 'WAITING':
            this.logger.logSocketEvent('send', 'start_ending', nextResponse);
            this.server.to(gsid).emit('start_ending', nextResponse);
            break;
        }
      }, 3000);
    }
  }

  @SubscribeMessage('send_guessing')
  handleGuessing(
    @MessageBody() data: { guessingWord: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;
    this.logger.logSocketEvent('receive', 'send_guessing', {
      userId,
      gsid,
      guessingWord: data.guessingWord,
    });

    const response = this.gatewayService.submitGuess(
      gsid,
      userId,
      data.guessingWord,
    );
    this.logger.logSocketEvent('send', 'start_ending', response);
    this.server.to(gsid).emit('start_ending', response);
  }
}
