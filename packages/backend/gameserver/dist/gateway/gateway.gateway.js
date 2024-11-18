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
    async handleConnection(client) {
        const userId = client.handshake.query.userId;
        const password = client.handshake.query.password;
        console.log('New connection attempt:', { userId, password });
        if (!this.authService.isValidGuest(userId, password)) {
            console.log('Authentication failed for user:', userId);
            client.disconnect();
            return;
        }
        client.data.userId = userId;
        console.log('Connection successful for user:', userId);
    }
    async handleDisconnect(client) {
        const userId = client.data.userId;
        const gsid = client.data.gsid;
        console.log('Disconnecting user:', { userId, gsid });
        if (gsid) {
            await this.roomService.leaveRoom(gsid, userId);
            client.leave(gsid);
            console.log('User left room:', { userId, gsid });
            this.server.to(gsid).emit('user_left', { userId });
            const newHostId = await this.roomService.getHostUserId(gsid);
            if (newHostId) {
                console.log('New host assigned:', { newHostId });
                this.server.to(gsid).emit('host_changed', { hostUserId: newHostId });
            }
        }
    }
    async handleLeaveRoom(client) {
        const userId = client.data.userId;
        const gsid = client.data.gsid;
        console.log('Leave room requested:', { userId, gsid });
        await this.roomService.leaveRoom(gsid, userId);
        client.leave(gsid);
        client.data.gsid = null;
        console.log('Room left successfully:', { gsid, userId });
        client.emit('leave_room_success', { gsid });
        this.server.to(gsid).emit('user_left', { userId });
        const newHostId = await this.roomService.getHostUserId(gsid);
        if (newHostId) {
            console.log('New host assigned:', { newHostId });
            this.server.to(gsid).emit('host_changed', { hostUserId: newHostId });
        }
    }
    async handleCreateRoom(client) {
        const userId = client.data.userId;
        console.log('Create room requested by user:', userId);
        try {
            const gsid = await this.roomService.createRoom(userId);
            client.join(gsid);
            client.data.gsid = gsid;
            console.log('Room created successfully:', { gsid, userId });
            client.emit('create_room_success', { gsid, isHost: true });
        }
        catch (error) {
            console.error('Create room failed:', { userId, error });
            client.emit('create_room_fail', { errorMessage: error.message });
        }
    }
    async handleJoinRoom(data, client) {
        const userId = client.data.userId;
        const { gsid } = data;
        console.log('Join room requested:', { userId, gsid });
        try {
            const roomInfo = await this.roomService.joinRoom(gsid, userId);
            client.join(gsid);
            client.data.gsid = gsid;
            console.log('Room joined successfully:', { gsid, userId, roomInfo });
            client.emit('join_room_success', {
                userIds: Array.from(roomInfo.userIds),
                readyUserIds: Array.from(roomInfo.readyUserIds),
                isHost: roomInfo.hostUserId === userId,
                hostUserId: roomInfo.hostUserId,
            });
            client.to(gsid).emit('user_joined', { userId });
        }
        catch (error) {
            console.error('Join room failed:', { userId, gsid, error });
            client.emit('join_room_fail', { errorMessage: error.message });
        }
    }
    async handleSendMessage(data, client) {
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
        }
        catch (error) {
            console.error('Message send failed:', { userId, gsid, error });
            client.emit('error', { errorMessage: error.message });
        }
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
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('create_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GatewayGateway.prototype, "handleSendMessage", null);
exports.GatewayGateway = GatewayGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        room_service_1.RoomService,
        game_service_1.GameService,
        chat_service_1.ChatService])
], GatewayGateway);
//# sourceMappingURL=gateway.gateway.js.map