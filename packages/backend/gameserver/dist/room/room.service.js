"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
let RoomService = class RoomService {
    constructor() {
        this.rooms = new Map();
    }
    async createRoom(hostUserId) {
        const gsid = `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newRoom = {
            gsid,
            hostUserId,
            userIds: new Set([hostUserId]),
            readyUserIds: new Set(),
        };
        this.rooms.set(gsid, newRoom);
        return gsid;
    }
    async joinRoom(gsid, userId) {
        const room = this.rooms.get(gsid);
        if (!room) {
            throw new Error('방을 찾을 수 없습니다.');
        }
        room.userIds.add(userId);
        return room;
    }
    async leaveRoom(gsid, userId) {
        const room = this.rooms.get(gsid);
        if (room) {
            room.userIds.delete(userId);
            room.readyUserIds.delete(userId);
            if (room.userIds.size === 0) {
                this.rooms.delete(gsid);
            }
            else if (room.hostUserId === userId) {
                room.hostUserId = Array.from(room.userIds)[0];
            }
        }
    }
    async getRoomInfo(gsid) {
        const room = this.rooms.get(gsid);
        if (!room) {
            throw new Error('방을 찾을 수 없습니다.');
        }
        return room;
    }
    async getHostUserId(gsid) {
        const room = this.rooms.get(gsid);
        return room ? room.hostUserId : null;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
//# sourceMappingURL=room.service.js.map