import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { GatewayService } from './gateway.service';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';

@Module({
  imports: [AuthModule, GameModule],
  providers: [GatewayGateway, GatewayService],
})
export class GatewayModule {}
