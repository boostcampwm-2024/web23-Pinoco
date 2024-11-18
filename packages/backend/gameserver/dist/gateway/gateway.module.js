"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const gateway_gateway_1 = require("./gateway.gateway");
const auth_module_1 = require("../auth/auth.module");
const room_module_1 = require("../room/room.module");
const game_module_1 = require("../game/game.module");
const chat_module_1 = require("../chat/chat.module");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, room_module_1.RoomModule, game_module_1.GameModule, chat_module_1.ChatModule],
        providers: [gateway_gateway_1.GatewayGateway],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map