"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth/auth.service");
const room_service_1 = require("../room/room.service");
const game_service_1 = require("../game/game.service");
const chat_service_1 = require("../chat/chat.service");
let GatewayGateway = class GatewayGateway {
    constructor(authService, roomService, gameService, chatService) {
        this.authService = authService;
        this.roomService = roomService;
        this.gameService = gameService;
        this.chatService = chatService;
    }
    handleConnection(client) {
        const usid = client.handshake.query.usid;
        console.log(`Attempting connection for usid: ${usid} from client: ${client.id}`);
        if (!this.authService.isValidGuest(usid)) {
            console.log(`Unauthorized connection: ${client.id} with usid: ${usid}`);
            client.disconnect();
            return;
        }
        console.log(`Client connected: ${client.id}, usid: ${usid}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(payload, client) {
        console.log(payload);
        console.log(`Received joinRoom request: roomId=${payload.roomId}, userId=${payload.userId} from client ${client.id}`);
        const response = this.roomService.joinRoom(payload.roomId, payload.userId);
        console.log(`User ${payload.userId} joined room ${payload.roomId}`);
        client.join(payload.roomId);
        this.server
            .to(payload.roomId)
            .emit('userJoined', { userId: payload.userId });
        console.log(`User joined event emitted for room ${payload.roomId}`);
        return response;
    }
    handleStartGame(payload, client) {
        console.log(`Received startGame request for roomId=${payload.roomId} from client ${client.id}`);
        const response = this.gameService.startGame(payload.roomId);
        console.log(`Game started in room ${payload.roomId}`);
        this.server
            .to(payload.roomId)
            .emit('gameStarted', { roomId: payload.roomId });
        console.log(`Game started event emitted for room ${payload.roomId}`);
        return response;
    }
    handleSendMessage(payload, client) {
        console.log(`Received sendMessage request: roomId=${payload.roomId}, message=${payload.message} from client ${client.id}`);
        const response = this.chatService.sendMessage(payload.roomId, payload.message);
        console.log(`Message sent in room ${payload.roomId}: ${payload.message}`);
        this.server
            .to(payload.roomId)
            .emit('newMessage', { message: payload.message });
        console.log(`New message event emitted for room ${payload.roomId}`);
        return response;
    }
    handleEcho(payload, client) {
        console.log(`Echo received from client ${client.id}:`, payload);
        client.emit('echoResponse', payload);
        console.log(`Echo response sent back to client ${client.id}`);
        return { status: 'success', payload };
    }
};
exports.GatewayGateway = GatewayGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GatewayGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('echo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GatewayGateway.prototype, "handleEcho", null);
exports.GatewayGateway = GatewayGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        room_service_1.RoomService,
        game_service_1.GameService,
        chat_service_1.ChatService])
], GatewayGateway);
//# sourceMappingURL=gateway.gateway.js.map