import { Injectable } from '@nestjs/common';
import { IGameState, GamePhase } from './types/game.types';
import { GAME_WORDS } from './constants/words';
import { WsException } from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  private games: Map<string, IGameState> = new Map();
  private readonly MAX_ROOM_SIZE = 6;

  createRoom(userId: string): IGameState {
    let gsid: string;
    do {
      gsid = uuidv4().substring(0, 4);
    } while (this.games.has(gsid));

    const gameState: IGameState = {
      gsid,
      userIds: new Set([userId]),
      readyUserIds: new Set(),
      hostUserId: userId,
      phase: 'WAITING',
    };

    this.games.set(gsid, gameState);
    return gameState;
  }

  joinRoom(userId: string, gsid: string, client: any): IGameState {
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (game.userIds.size >= this.MAX_ROOM_SIZE) {
      throw new WsException('방이 가득 찼습니다.');
    }

    if (game.phase !== 'WAITING') {
      throw new WsException('게임이 진행중입니다.');
    }

    game.userIds.add(userId);
    client.join(gsid);
    client.data.gsid = gsid;

    return game;
  }

  leaveRoom(userId: string, gsid: string, client: any): IGameState | null {
    const game = this.getGameState(gsid);
    if (!game) return null;

    game.userIds.delete(userId);
    game.readyUserIds.delete(userId);

    if (client) {
      client.leave(gsid);
      client.data.gsid = null;
    }

    if (game.userIds.size === 0) {
      this.games.delete(gsid);
      return null;
    }

    if (game.hostUserId === userId) {
      game.hostUserId = Array.from(game.userIds)[0];
    }

    return game;
  }

  handleReady(gsid: string, userId: string, isReady: boolean): IGameState {
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (game.phase !== 'WAITING') {
      throw new WsException('게임이 이미 시작되었습니다.');
    }

    if (isReady) {
      game.readyUserIds.add(userId);
    } else {
      game.readyUserIds.delete(userId);
    }

    return game;
  }

  startGame(gsid: string): IGameState {
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (game.userIds.size < 3) {
      throw new WsException(
        '게임을 시작하려면 최소 3명의 플레이어가 필요합니다.',
      );
    }

    if (game.readyUserIds.size !== game.userIds.size - 1) {
      throw new WsException('모든 참가자가 준비되어야 합니다.');
    }

    const userIds = Array.from(game.userIds);
    const pinocoIndex = Math.floor(Math.random() * userIds.length);

    const themeIndex = Math.floor(Math.random() * GAME_WORDS.length);
    const selectedTheme = GAME_WORDS[themeIndex];

    const word =
      selectedTheme.words[
        Math.floor(Math.random() * selectedTheme.words.length)
      ];

    game.word = word;
    game.theme = selectedTheme.theme;
    game.pinocoId = userIds[pinocoIndex];
    game.liveUserIds = [...userIds];
    game.votes = {};

    this.startSpeakingPhase(gsid);
    return game;
  }

  startSpeakingPhase(gsid: string): IGameState {
    const game = this.getGameState(gsid);
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

  endSpeaking(gsid: string, userId: string): IGameState {
    const game = this.getGameState(gsid);
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
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (!game.liveUserIds.includes(voterId)) {
      return game;
    }

    game.votes[voterId] = targetId;
    return game;
  }

  processVoteResult(gsid: string): IGameState {
    const game = this.getGameState(gsid);
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
      game.phase = 'WAITING';
      this.resetGame(gsid);
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
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    if (game.pinocoId !== userId) {
      throw new WsException('피노코만 단어를 추측할 수 있습니다.');
    }

    game.guessingWord = word;
    game.phase = 'WAITING';
    game.isPinocoWin = game.word === word;
    this.resetGame(gsid);
    return game;
  }

  resetGame(gsid: string): void {
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }

    game.phase = 'WAITING';
    game.readyUserIds.clear();
  }

  getGameState(gsid: string): IGameState {
    const game = this.games.get(gsid);
    if (!game) {
      throw new WsException('게임을 찾을 수 없습니다.');
    }
    return game;
  }

  createMessage(
    userId: string,
    message: string,
    gsid: string,
    server: any,
  ): IGameState {
    const game = this.getGameState(gsid);
    if (!game) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (!game.userIds.has(userId)) {
      throw new WsException('방에 참여하지 않은 사용자입니다.');
    }

    server.to(gsid).emit('receive_message', {
      userId,
      message,
      timestamp: Date.now(),
    });

    return game;
  }
}
