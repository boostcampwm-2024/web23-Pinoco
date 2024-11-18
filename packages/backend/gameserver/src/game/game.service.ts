import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  private gameStates: Map<string, any> = new Map();

  startGame(roomId: string): string {
    this.gameStates.set(roomId, { started: true });
    return `Game started in room ${roomId}`;
  }

  getGameState(roomId: string): any {
    return this.gameStates.get(roomId);
  }
}
