import { Injectable } from '@nestjs/common';
import { IGameState, GamePhase } from './types/game.types';
import { RoomService } from '../room/room.service';
import { GAME_WORDS } from './constants/words';

@Injectable()
export class GameService {
  private games: Map<string, IGameState> = new Map();

  constructor(private readonly roomService: RoomService) {}

  async startGame(gsid: string): Promise<IGameState> {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    const userIds = Array.from(room.userIds);
    const pinocoIndex = Math.floor(Math.random() * userIds.length);

    // 랜덤하게 테마 선택
    const themeIndex = Math.floor(Math.random() * GAME_WORDS.length);
    const selectedTheme = GAME_WORDS[themeIndex];

    // 선택된 테마에서 랜덤하게 단어 선택
    const word =
      selectedTheme.words[
        Math.floor(Math.random() * selectedTheme.words.length)
      ];

    const gameState: IGameState = {
      phase: 'GAMESTART',
      userIds,
      word,
      theme: selectedTheme.theme, // 테마 정보 추가
      pinocoId: userIds[pinocoIndex],
      liveUserIds: [...userIds],
      speakerQueue: [],
      votes: {},
    };

    this.games.set(gsid, gameState);
    this.startSpeakingPhase(gsid);
    return gameState;
  }

  startSpeakingPhase(gsid: string): void {
    const game = this.games.get(gsid);
    if (!game) return;

    const shuffledUserIds = [...game.liveUserIds];
    for (let i = shuffledUserIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledUserIds[i], shuffledUserIds[j]] = [
        shuffledUserIds[j],
        shuffledUserIds[i],
      ];
    }
    game.speakerQueue = shuffledUserIds;

    game.phase = 'SPEAKING';
  }

  getGameState(gsid: string): IGameState | undefined {
    return this.games.get(gsid);
  }

  async endSpeaking(gsid: string): Promise<string | null> {
    const game = this.games.get(gsid);
    if (!game) return;

    game.speakerQueue.shift();
    if (game.speakerQueue.length === 0) {
      game.phase = 'VOTING';
      return;
    }
    return;
  }

  async submitVote(
    gsid: string,
    voterId: string,
    targetId: string,
  ): Promise<void> {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    // 투표자가 살아있는 사람인지 확인 (원래는 죽은사람은 vote_pinoco 요청이 안 오는게 맞으나 클라측(타이머) 이슈로 보내지는 상황)
    if (!game.liveUserIds.includes(voterId)) return;

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

    const maxVotedUsers = Object.entries(voteCount).filter(
      ([, count]) => count === maxVotes,
    );

    const deadPerson =
      maxVotedUsers.length !== 1 ? '' : maxVotedUsers[0]?.[0] || '';

    //동점인경우
    if (deadPerson !== '') {
      game.liveUserIds = game.liveUserIds.filter((id) => id !== deadPerson);
    }

    // 피노코가 죽은 경우 => GUESSING 시작
    game.votes = {};
    if (deadPerson === game.pinocoId) {
      game.phase = 'GUESSING';
    } else if (game.liveUserIds.length <= 2) {
      game.phase = 'ENDING';
    } else {
      this.startSpeakingPhase(gsid);
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

  endGame(gsid: string) {
    this.games.delete(gsid);
  }
}
