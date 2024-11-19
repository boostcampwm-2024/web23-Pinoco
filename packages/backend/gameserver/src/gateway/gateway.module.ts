import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { AuthModule } from '../auth/auth.module';
import { RoomModule } from '../room/room.module';
import { GameModule } from '../game/game.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [AuthModule, RoomModule, GameModule, ChatModule],
  providers: [GatewayGateway],
})
export class GatewayModule {}
