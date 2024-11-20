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
import { RoomEventPayload, JoinRoomResponse } from '../room/types/room.types';
import { LoggerService } from '../logger/logger.service';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly logger: LoggerService,
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

  private emitUserLeft(gsid: string, payload: RoomEventPayload): void {
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
}
