import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { LoggerModule } from './logger/logger.module';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';

@Module({
  imports: [LoggerModule, AuthModule, GatewayModule, RoomModule, GameModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
