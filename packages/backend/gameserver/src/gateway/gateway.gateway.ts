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

  handleConnection(@ConnectedSocket() client: Socket) {
    const usid = client.handshake.query.usid as string;

    console.log(
      `Attempting connection for usid: ${usid} from client: ${client.id}`,
    );

    if (!this.authService.isValidGuest(usid)) {
      console.log(`Unauthorized connection: ${client.id} with usid: ${usid}`);
      client.disconnect();
      return;
    }

    console.log(`Client connected: ${client.id}, usid: ${usid}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() payload: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(payload);
    console.log(
      `Received joinRoom request: roomId=${payload.roomId}, userId=${payload.userId} from client ${client.id}`,
    );

    const response = this.roomService.joinRoom(payload.roomId, payload.userId);

    console.log(`User ${payload.userId} joined room ${payload.roomId}`);
    client.join(payload.roomId);

    this.server
      .to(payload.roomId)
      .emit('userJoined', { userId: payload.userId });

    console.log(`User joined event emitted for room ${payload.roomId}`);
    return response;
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `Received startGame request for roomId=${payload.roomId} from client ${client.id}`,
    );

    const response = this.gameService.startGame(payload.roomId);

    console.log(`Game started in room ${payload.roomId}`);
    this.server
      .to(payload.roomId)
      .emit('gameStarted', { roomId: payload.roomId });

    console.log(`Game started event emitted for room ${payload.roomId}`);
    return response;
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() payload: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `Received sendMessage request: roomId=${payload.roomId}, message=${payload.message} from client ${client.id}`,
    );

    const response = this.chatService.sendMessage(
      payload.roomId,
      payload.message,
    );

    console.log(`Message sent in room ${payload.roomId}: ${payload.message}`);
    this.server
      .to(payload.roomId)
      .emit('newMessage', { message: payload.message });

    console.log(`New message event emitted for room ${payload.roomId}`);
    return response;
  }

  @SubscribeMessage('echo')
  handleEcho(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    console.log(`Echo received from client ${client.id}:`, payload);

    client.emit('echoResponse', payload);

    console.log(`Echo response sent back to client ${client.id}`);
    return { status: 'success', payload };
  }
}
