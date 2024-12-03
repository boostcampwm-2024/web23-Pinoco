import { Injectable } from '@nestjs/common';
import { IGameState, GamePhase } from './types/game.types';
import { RoomService } from '../room/room.service';
import { GAME_WORDS } from './constants/words';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class GameService {
  private games: Map<string, IGameState> = new Map();

  constructor(private readonly roomService: RoomService) {}

  startGame(gsid: string): IGameState {
    const room = this.roomService.getRoom(gsid);
    if (!room) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (room.userIds.size < 3) {
      throw new WsException(
        '게임을 시작하려면 최소 3명의 플레이어가 필요합니다.',
      );
    }

    if (room.readyUserIds.size !== room.userIds.size - 1) {
      throw new WsException('모든 참가자가 준비되어야 합니다.');
    }

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
    room.isPlaying = true;
    return gameState;
  }

  startSpeakingPhase(gsid: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

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
    return game;
  }

  getGameState(gsid: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }
    return game;
  }

  endSpeaking(gsid: string, userId: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (game.speakerQueue[0] !== userId) {
      throw new WsException('현재 발언 차례가 아닙니다.');
    }

    game.speakerQueue.shift();
    if (game.speakerQueue.length === 0) {
      game.phase = 'VOTING';
    }

    return game;
  }

  submitVote(gsid: string, voterId: string, targetId: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (!game.liveUserIds.includes(voterId)) {
      // 투표자가 살아있는 사람인지 확인 (원래는 죽은사람은 vote_pinoco 요청이 안 오는게 맞으나 클라측(타이머) 이슈로 보내지는 상황)
      //throw new WsException('투표할 수 없는 사용자입니다.');
      return game;
    }

    console.log(voterId, targetId);

    game.votes[voterId] = targetId;
    return game;
  }

  processVoteResult(gsid: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (Object.keys(game.votes).length !== game.liveUserIds.length) {
      throw new WsException('모든 사용자가 투표를 완료하지 않았습니다.');
    }

    const voteCount: Record<string, number> = {};
    Object.values(game.votes).forEach((targetId) => {
      voteCount[targetId] = (voteCount[targetId] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(voteCount));
    const maxVotedUsers = Object.entries(voteCount).filter(
      ([, count]) => count === maxVotes,
    );

    const deadPerson = maxVotedUsers.length === 1 ? maxVotedUsers[0][0] : '';

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

    game.voteResult = {
      voteCount,
      deadPerson,
      isDeadPersonPinoco: deadPerson === game.pinocoId,
    };

    return game;
  }

  submitGuess(gsid: string, userId: string, word: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (game.pinocoId !== userId) {
      throw new WsException('피노코만 단어를 추측할 수 있습니다.');
    }

    game.guessingWord = word;
    game.phase = 'ENDING';
    game.isPinocoWin = game.word === word;
    return game;
  }

  endGame(gsid: string): void {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    const room = this.roomService.getRoom(gsid);
    if (room) {
      room.isPlaying = false;
      room.readyUserIds.clear();
    }

    this.games.delete(gsid);
  }
}
