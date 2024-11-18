import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';
import { ChatService } from '../chat/chat.service';
export declare class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly roomService;
    private readonly gameService;
    private readonly chatService;
    server: Server;
    constructor(authService: AuthService, roomService: RoomService, gameService: GameService, chatService: ChatService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleLeaveRoom(client: Socket): Promise<void>;
    handleCreateRoom(client: Socket): Promise<void>;
    handleJoinRoom(data: {
        gsid: string;
    }, client: Socket): Promise<void>;
    handleSendMessage(data: {
        message: string;
    }, client: Socket): Promise<void>;
}
