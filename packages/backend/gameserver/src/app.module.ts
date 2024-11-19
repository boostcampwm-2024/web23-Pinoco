import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, GatewayModule, RoomModule, GameModule, ChatModule],
})
export class AppModule {}
