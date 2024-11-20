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

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly gatewayService: GatewayService) {}

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.handshake.query.userId as string;
    const password = client.handshake.query.password as string;

    const isValid = await this.gatewayService.validateConnection(
      userId,
      password,
    );
    if (!isValid) {
      this.emitError(client, '인증에 실패했습니다.');
      client.disconnect();
      return;
    }

    client.data.userId = userId;
  }

  async handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;

    const result = await this.gatewayService.handleDisconnection(gsid, userId);
    if (result) {
      this.emitUserLeft(gsid, result);
    }
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    const { userId, gsid } = client.data;

    const result = await this.gatewayService.handleLeaveRoom(gsid, userId);
    if (result) {
      this.emitUserLeft(gsid, result);
    }

    this.handleRoomLeave(client);
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const result = await this.gatewayService.createRoom(client.data.userId);
      this.handleRoomJoin(client, result.gsid);
      client.emit('create_room_success', result);
    } catch (error) {
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const roomInfo = await this.gatewayService.joinRoom(
        data.gsid,
        client.data.userId,
      );
      this.handleRoomJoin(client, data.gsid);

      client.emit('join_room_success', roomInfo);
      this.emitUserJoined(data.gsid, client.data.userId);
    } catch (error) {
      this.emitError(client, error.message);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { userId, gsid } = client.data;

    if (!gsid) {
      this.emitError(client, '방에 참여되어 있지 않습니다.');
      return;
    }

    try {
      await this.gatewayService.saveMessage(gsid, userId, data.message);
      this.emitMessage(gsid, { userId, message: data.message });
    } catch (error) {
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
    client.emit('error', { errorMessage: message } as ErrorResponse);
  }
}
