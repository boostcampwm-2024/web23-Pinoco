import { Injectable } from '@nestjs/common';
import { IGameState, GamePhase } from './types/game.types';
import { RoomService } from '../room/room.service';

@Injectable()
export class GameService {
  private games: Map<string, IGameState> = new Map();
  private words = ['사과', '바나나', '자동차', '컴퓨터']; // 예시 단어들

  constructor(private readonly roomService: RoomService) {}

  async startGame(gsid: string): Promise<IGameState> {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    const userIds = Array.from(room.userIds);
    const pinocoIndex = Math.floor(Math.random() * userIds.length);
    const word = this.words[Math.floor(Math.random() * this.words.length)];

    const gameState: IGameState = {
      phase: 'GAMESTART',
      word,
      pinocoId: userIds[pinocoIndex],
      speakerQueue: [...userIds],
      currentSpeakerId: userIds[0],
      votes: {},
      spokenUsers: new Set(),
    };

    this.games.set(gsid, gameState);
    return gameState;
  }

  getGameState(gsid: string): IGameState | undefined {
    return this.games.get(gsid);
  }

  async startSpeaking(gsid: string): Promise<string | null> {
    const game = this.games.get(gsid);
    if (!game) return null;

    game.phase = 'SPEAKING';
    game.currentSpeakerId = game.speakerQueue.shift() || null;
    return game.currentSpeakerId;
  }

  async endSpeaking(gsid: string): Promise<boolean> {
    const game = this.games.get(gsid);
    if (!game) return false;

    const room = this.roomService.getRoom(gsid);
    if (!room) return false;

    // 현재 발언자를 발언 완료 목록에 추가
    if (game.currentSpeakerId) {
      game.spokenUsers.add(game.currentSpeakerId);
    }

    // 모든 사용자가 발언을 마쳤는지 확인
    const totalUsers = room.userIds.size;
    if (game.spokenUsers.size === totalUsers) {
      game.phase = 'VOTING';
      return true;
    }

    // 아직 발언하지 않은 다음 발언자 찾기
    const nextSpeaker = Array.from(room.userIds).find(
      (userId) => !game.spokenUsers.has(userId),
    );

    game.currentSpeakerId = nextSpeaker || null;
    return false;
  }

  async submitVote(
    gsid: string,
    voterId: string,
    targetId: string,
  ): Promise<void> {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    game.votes[voterId] = targetId;
  }

  async processVoteResult(gsid: string): Promise<{
    voteResult: Record<string, number>;
    deadPerson: string;
  }> {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    const voteCount: Record<string, number> = {};
    Object.values(game.votes).forEach((targetId) => {
      voteCount[targetId] = (voteCount[targetId] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(voteCount));
    const deadPerson =
      Object.entries(voteCount).find(([, count]) => count === maxVotes)?.[0] ||
      'none';

    if (deadPerson === game.pinocoId) {
      game.phase = 'GUESSING';
    } else {
      game.phase = 'SPEAKING';
      // 발언 순서 재설정
      const room = this.roomService.getRoom(gsid);
      if (room) {
        game.speakerQueue = Array.from(room.userIds);
      }
    }

    return { voteResult: voteCount, deadPerson };
  }

  async submitGuess(gsid: string, word: string): Promise<boolean> {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    game.guessingWord = word;
    game.isGuessed = game.word === word;
    game.phase = 'ENDING';

    return game.isGuessed;
  }

  async endGame(gsid: string): Promise<void> {
    this.games.delete(gsid);
  }
}
