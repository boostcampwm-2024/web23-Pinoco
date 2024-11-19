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

    console.log('New connection attempt:', { userId, password });

    if (!this.authService.isValidGuest(userId, password)) {
      console.log('Authentication failed for user:', userId);
      client.disconnect();
      return;
    }

    // 사용자 ID를 소켓 데이터에 저장
    client.data.userId = userId;
    console.log('Connection successful for user:', userId);
  }

  // 소켓 연결 해제 시 처리
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const gsid = client.data.gsid;

    console.log('Disconnecting user:', { userId, gsid });

    if (gsid) {
      await this.roomService.leaveRoom(gsid, userId);
      client.leave(gsid);
      console.log('User left room:', { userId, gsid });

      // 다른 사용자들에게 알림
      const hostUserId = await this.roomService.getHostUserId(gsid);
      this.server.to(gsid).emit('user_left', { userId, hostUserId });
    }
  }

  // 게임방 나가기 요청 처리
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    const gsid = client.data.gsid;

    console.log('Leave room requested:', { userId, gsid });

    await this.roomService.leaveRoom(gsid, userId);
    client.leave(gsid);
    client.data.gsid = null; // 클라이언트 세션에서 gsid 제거

    console.log('Room left successfully:', { gsid, userId });
    client.emit('leave_room_success', { gsid });

    // 다른 사용자들에게 알림
    this.server.to(gsid).emit('user_left', { userId });

    // 방장이 나갔을 경우 방장 변경
    const newHostId = await this.roomService.getHostUserId(gsid);
    if (newHostId) {
      console.log('New host assigned:', { newHostId });
      this.server.to(gsid).emit('host_changed', { hostUserId: newHostId });
    }
  }

  // 게임방 생성 요청 처리
  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    console.log('Create room requested by user:', userId);

    try {
      const gsid = await this.roomService.createRoom(userId);
      client.join(gsid);
      client.data.gsid = gsid; // 클라이언트 세션에 gsid 저장

      console.log('Room created successfully:', { gsid, userId });
      client.emit('create_room_success', { gsid, isHost: true });
    } catch (error) {
      console.error('Create room failed:', { userId, error });
      client.emit('create_room_fail', { errorMessage: error.message });
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

    console.log('Join room requested:', { userId, gsid });

    try {
      const roomInfo = await this.roomService.joinRoom(gsid, userId);
      client.join(gsid);
      client.data.gsid = gsid; // 클라이언트 세션에 gsid 저장

      console.log('Room joined successfully:', { gsid, userId, roomInfo });
      client.emit('join_room_success', {
        userIds: Array.from(roomInfo.userIds),
        readyUserIds: Array.from(roomInfo.readyUserIds),
        isHost: roomInfo.hostUserId === userId,
        hostUserId: roomInfo.hostUserId,
      });

      // 다른 사용자들에게 참가 알림
      client.to(gsid).emit('user_joined', { userId });
    } catch (error) {
      console.error('Join room failed:', { userId, gsid, error });
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

    console.log('Message send requested:', {
      userId,
      gsid,
      message: data.message,
    });

    if (!gsid) {
      console.error('User not in room:', { userId });
      client.emit('error', { errorMessage: '방에 참여되어 있지 않습니다.' });
      return;
    }

    const { message } = data;

    try {
      await this.chatService.saveMessage(gsid, userId, message);
      console.log('Message saved and broadcasted:', { userId, gsid, message });
      this.server.to(gsid).emit('receive_message', { userId, message });
    } catch (error) {
      console.error('Message send failed:', { userId, gsid, error });
      client.emit('error', { errorMessage: error.message });
    }
  }
}
