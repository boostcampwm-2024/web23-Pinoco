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
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(payload: {
        roomId: string;
        userId: string;
    }, client: Socket): string;
    handleStartGame(payload: {
        roomId: string;
    }, client: Socket): string;
    handleSendMessage(payload: {
        roomId: string;
        message: string;
    }, client: Socket): string;
    handleEcho(payload: any, client: Socket): {
        status: string;
        payload: any;
    };
}
