import { Injectable } from '@nestjs/common';
import { IGameState, GamePhase } from './types/game.types';
import { RoomService } from '../room/room.service';
import { GAME_WORDS } from './constants/words';

@Injectable()
export class GameService {
  private games: Map<string, IGameState> = new Map();

  constructor(private readonly roomService: RoomService) {}

  startGame(gsid: string): IGameState {
    const room = this.roomService.getRoom(gsid);
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    const userIds = Array.from(room.userIds);
    const pinocoIndex = Math.floor(Math.random() * userIds.length);

    const themeIndex = Math.floor(Math.random() * GAME_WORDS.length);
    const selectedTheme = GAME_WORDS[themeIndex];

    const word =
      selectedTheme.words[
        Math.floor(Math.random() * selectedTheme.words.length)
      ];

    const gameState: IGameState = {
      phase: 'GAMESTART',
      userIds,
      word,
      theme: selectedTheme.theme,
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

  endSpeaking(gsid: string): void {
    const game = this.games.get(gsid);
    if (!game) return;

    game.speakerQueue.shift();
    if (game.speakerQueue.length === 0) {
      game.phase = 'VOTING';
    }
  }

  submitVote(gsid: string, voterId: string, targetId: string): void {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    if (!game.liveUserIds.includes(voterId)) return;

    game.votes[voterId] = targetId;
  }

  processVoteResult(gsid: string) {
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

    if (deadPerson !== '') {
      game.liveUserIds = game.liveUserIds.filter((id) => id !== deadPerson);
    }

    game.votes = {};
    if (deadPerson === game.pinocoId) {
      game.phase = 'GUESSING';
    } else if (game.liveUserIds.length <= 2) {
      game.phase = 'ENDING';
    } else {
      this.startSpeakingPhase(gsid);
    }

    const isDeadPersonPinoco = deadPerson === game.pinocoId;

    return { voteResult: voteCount, deadPerson, isDeadPersonPinoco };
  }

  submitGuess(gsid: string, word: string): boolean {
    const game = this.games.get(gsid);
    if (!game) throw new Error('게임을 찾을 수 없습니다.');

    game.guessingWord = word;
    game.phase = 'ENDING';
    return game.word === word;
  }

  endGame(gsid: string): void {
    this.games.delete(gsid);
  }
}
