import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
