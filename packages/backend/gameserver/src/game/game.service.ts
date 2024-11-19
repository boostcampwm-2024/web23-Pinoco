import { Injectable } from '@nestjs/common';

interface Game {
  gsid: string;
  isStarted: boolean;
}

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map();

  // 게임 시작
  async startGame(gsid: string): Promise<void> {
    if (this.games.has(gsid)) {
      throw new Error('이미 게임이 시작되었습니다.');
    }
    this.games.set(gsid, { gsid, isStarted: true });
  }

  // 게임 상태 확인
  async isGameStarted(gsid: string): Promise<boolean> {
    const game = this.games.get(gsid);
    return game ? game.isStarted : false;
  }

  // 게임 종료
  async endGame(gsid: string): Promise<void> {
    this.games.delete(gsid);
  }
}
