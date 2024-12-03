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
import { WsException } from '@nestjs/websockets';

@WebSocketGateway()
@UseFilters(WebSocketExceptionFilter)
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly gatewayService: GatewayService) {}

  handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const userId = client.handshake.query.userId as string;
      const password = client.handshake.query.password as string;

      const isValid = this.gatewayService.validateConnection(userId, password);
      if (!isValid) {
        client.emit('error', { message: '인증에 실패했습니다.' });
        client.disconnect();
        return;
      }

      client.data.userId = userId;
    } catch (error) {
      client.emit('error', { message: '연결 중 오류가 발생했습니다.' });
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    if (!userId || !gsid) return;

    const result = this.gatewayService.handleDisconnection(
      gsid,
      userId,
      client,
    );
    if (result) {
      this.server.to(gsid).emit('user_left', result);
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;
    const result = this.gatewayService.handleLeaveRoom(gsid, userId, client);
    if (result) {
      this.server.to(gsid).emit('user_left', result);
    }
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.data.userId;
    const result = this.gatewayService.createRoom(userId);
    this.gatewayService.joinRoom(result.gsid, userId, client);
    client.emit('create_room_success', result);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { joinRoomData, userJoinedData } = this.gatewayService.joinRoom(
      data.gsid,
      client.data.userId,
      client,
    );

    client.emit('join_room_success', joinRoomData);
    this.server.to(data.gsid).emit('user_joined', userJoinedData);
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

    this.gatewayService.createMessage(gsid, userId, data.message, this.server);
  }

  @SubscribeMessage('send_ready')
  handleReady(
    @MessageBody() data: { isReady: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;
    this.gatewayService.handleReady(gsid, userId, data.isReady, this.server);
  }

  @SubscribeMessage('start_game')
  handleStartGame(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    const { userSpecificData } = this.gatewayService.startGame(gsid, userId);

    Object.entries(userSpecificData).forEach(([uid, data]) => {
      const sockets = this.server.sockets.sockets;
      for (const [, socket] of sockets.entries()) {
        if ((socket as AuthenticatedSocket).data.userId === uid) {
          socket.emit('start_game_success', data);
          break;
        }
      }
    });
  }

  @SubscribeMessage('end_speaking')
  handleEndSpeaking(@ConnectedSocket() client: AuthenticatedSocket) {
    const { gsid, userId } = client.data;
    const { nextPhase, response } = this.gatewayService.handleSpeakingEnd(
      gsid,
      userId,
    );

    if (nextPhase === 'VOTING') {
      this.server.to(gsid).emit('start_vote');
    } else {
      this.server.to(gsid).emit('start_speaking', response);
    }
  }

  @SubscribeMessage('vote_pinoco')
  handleVote(
    @MessageBody() data: { voteUserId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { gsid, userId } = client.data;

    const result = this.gatewayService.submitVote(
      gsid,
      userId,
      data.voteUserId,
    );

    if (result.shouldProcessVote && result.voteResult) {
      const { nextPhase, voteResponse, nextResponse } = result.voteResult;

      this.server.to(gsid).emit('receive_vote_result', voteResponse);

      setTimeout(() => {
        switch (nextPhase) {
          case 'GUESSING':
            this.server.to(gsid).emit('start_guessing', nextResponse);
            break;
          case 'SPEAKING':
            this.server.to(gsid).emit('start_speaking', nextResponse);
            break;
          case 'WAITING':
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
    const response = this.gatewayService.submitGuess(
      gsid,
      userId,
      data.guessingWord,
    );
    this.server.to(gsid).emit('start_ending', response);
  }
}
