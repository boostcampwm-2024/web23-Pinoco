import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway()
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
    private readonly chatService: ChatService,
  ) {}

  // 소켓 연결 시 인증 처리
  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    const password = client.handshake.query.password as string;

    if (!this.authService.isValidGuest(userId, password)) {
      client.disconnect();
      return;
    }

    client.data.userId = userId;
  }

  // 소켓 연결 해제 시 처리
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const gsid = client.data.gsid;

    if (gsid) {
      await this.roomService.leaveRoom(gsid, userId);
      client.leave(gsid);

      const hostUserId = await this.roomService.getHostUserId(gsid);
      console.log('Event: user_left', {
        event: 'user_left',
        payload: { userId, hostUserId },
      });
      this.server.to(gsid).emit('user_left', { userId, hostUserId });
    }
  }

  // 게임방 나가기 요청 처리
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const gsid = client.data.gsid;

    await this.roomService.leaveRoom(gsid, userId);
    client.leave(gsid);
    client.data.gsid = null;

    const hostUserId = await this.roomService.getHostUserId(gsid);
    console.log('Event: user_left', {
      event: 'user_left',
      payload: { userId, hostUserId },
    });
    this.server.to(gsid).emit('user_left', { userId, hostUserId });
  }

  // 게임방 생성 요청 처리
  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    try {
      const gsid = await this.roomService.createRoom(userId);
      client.join(gsid);
      client.data.gsid = gsid;

      console.log('Event: create_room_success', {
        event: 'create_room_success',
        payload: { gsid, isHost: true },
      });
      client.emit('create_room_success', { gsid, isHost: true });
    } catch (error) {
      console.log('Event: error', {
        event: 'error',
        payload: { errorMessage: error.message },
      });
      client.emit('error', { errorMessage: error.message });
    }
  }

  // 게임방 참가 요청 처리
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { gsid: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const { gsid } = data;

    try {
      const roomInfo = await this.roomService.joinRoom(gsid, userId);
      client.join(gsid);
      client.data.gsid = gsid;

      const joinRoomPayload = {
        userIds: Array.from(roomInfo.userIds),
        readyUserIds: Array.from(roomInfo.readyUserIds),
        isHost: roomInfo.hostUserId === userId,
        hostUserId: roomInfo.hostUserId,
      };

      console.log('Event: join_room_success', {
        event: 'join_room_success',
        payload: joinRoomPayload,
      });
      client.emit('join_room_success', joinRoomPayload);

      console.log('Event: user_joined', {
        event: 'user_joined',
        payload: { userId },
      });
      client.to(gsid).emit('user_joined', { userId });
    } catch (error) {
      console.log('Event: join_room_fail', {
        event: 'join_room_fail',
        payload: { errorMessage: error.message },
      });
      client.emit('join_room_fail', { errorMessage: error.message });
    }
  }

  // 채팅 메시지 보내기 처리
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const gsid = client.data.gsid;

    if (!gsid) {
      console.log('Event: error', {
        event: 'error',
        payload: { errorMessage: '방에 참여되어 있지 않습니다.' },
      });
      client.emit('error', { errorMessage: '방에 참여되어 있지 않습니다.' });
      return;
    }

    const { message } = data;

    try {
      await this.chatService.saveMessage(gsid, userId, message);
      console.log('Event: receive_message', {
        event: 'receive_message',
        payload: { userId, message },
      });
      this.server.to(gsid).emit('receive_message', { userId, message });
    } catch (error) {
      console.log('Event: error', {
        event: 'error',
        payload: { errorMessage: error.message },
      });
      client.emit('error', { errorMessage: error.message });
    }
  }
}
