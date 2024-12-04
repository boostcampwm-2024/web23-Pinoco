import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GameService } from '../game/game.service';
import {
  IGameState,
  GamePhase,
  Istart_game_success,
  Istart_speaking,
  Ireceive_vote_result,
  Istart_guessing,
  Istart_ending,
  Iuser_left,
  Ijoin_room_success,
  Iupdate_ready,
  Iuser_joined,
  Icreate_room_success,
  Ireceive_message,
} from '../game/types/game.types';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket.types';

@Injectable()
export class GatewayService {
  constructor(
    private readonly authService: AuthService,
    private readonly gameService: GameService,
  ) {}

  validateConnection(userId: string, password: string): boolean {
    return this.authService.isValidGuest(userId, password);
  }

  handleDisconnection(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left | null {
    const game = this.gameService.leaveRoom(userId, gsid, client);
    if (!game) {
      return null;
    }
    return {
      userId,
      hostUserId: game.hostUserId,
    };
  }

  handleLeaveRoom(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left {
    const game = this.gameService.leaveRoom(userId, gsid, client);
    return {
      userId,
      hostUserId: game.hostUserId,
    };
  }

  createRoom(userId: string): Icreate_room_success {
    const game = this.gameService.createRoom(userId);
    return {
      gsid: game.gsid,
      isHost: true,
    };
  }

  joinRoom(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): {
    joinRoomData: Ijoin_room_success;
    userJoinedData: Iuser_joined;
  } {
    const game = this.gameService.joinRoom(userId, gsid, client);

    return {
      joinRoomData: {
        userIds: Array.from(game.userIds),
        readyUserIds: Array.from(game.readyUserIds),
        isHost: game.hostUserId === userId,
        hostUserId: game.hostUserId,
      },
      userJoinedData: {
        userId,
      },
    };
  }

  createMessage(
    gsid: string,
    userId: string,
    message: string,
    server: Server,
  ): Ireceive_message {
    const game = this.gameService.createMessage(userId, message, gsid, server);
    return {
      userId,
      message,
      timestamp: Date.now(),
    };
  }

  handleReady(
    gsid: string,
    userId: string,
    isReady: boolean,
    server: Server,
  ): Iupdate_ready {
    const game = this.gameService.handleReady(gsid, userId, isReady);
    return {
      readyUsers: Array.from(game.readyUserIds),
    };
  }

  startGame(gsid: string, userId: string): Istart_game_success {
    const gameState = this.gameService.startGame(gsid);
    const userSpecificData: Istart_game_success['userSpecificData'] = {};

    Array.from(gameState.userIds).forEach((uid) => {
      const isPinoco = gameState.pinocoId === uid;
      userSpecificData[uid] = {
        isPinoco,
        theme: gameState.theme,
        word: isPinoco ? '' : gameState.word,
        speakerId: gameState.speakerQueue[0],
        allUserIds: Array.from(gameState.userIds),
      };
    });

    return { userSpecificData };
  }

  handleSpeakingEnd(
    gsid: string,
    userId: string,
  ): {
    nextPhase: GamePhase;
    response: Istart_speaking | null;
  } {
    const gameState = this.gameService.endSpeaking(gsid, userId);

    if (gameState.phase === 'SPEAKING') {
      return {
        nextPhase: 'SPEAKING',
        response: { speakerId: gameState.speakerQueue[0] },
      };
    }

    return {
      nextPhase: 'VOTING',
      response: null,
    };
  }

  submitVote(
    gsid: string,
    voterId: string,
    targetId: string,
  ): {
    shouldProcessVote: boolean;
    voteResult?: {
      nextPhase: GamePhase;
      voteResponse: Ireceive_vote_result;
      nextResponse?: Istart_speaking | Istart_guessing | Istart_ending;
      delay?: number;
    };
  } {
    const gameState = this.gameService.submitVote(gsid, voterId, targetId);

    if (
      !gameState.votes ||
      Object.keys(gameState.votes).length !== gameState.liveUserIds.length
    ) {
      return { shouldProcessVote: false };
    }

    const newGameState = this.gameService.processVoteResult(gsid);
    const voteResponse: Ireceive_vote_result = {
      voteResult: newGameState.voteResult.voteCount,
      deadPerson: newGameState.voteResult.deadPerson,
      isDeadPersonPinoco: newGameState.voteResult.isDeadPersonPinoco,
    };

    let nextResponse: Istart_speaking | Istart_guessing | Istart_ending;
    if (newGameState.phase === 'GUESSING') {
      nextResponse = { guessingUserId: newGameState.pinocoId };
    } else if (newGameState.phase === 'SPEAKING') {
      nextResponse = { speakerId: newGameState.speakerQueue[0] };
    } else if (newGameState.phase === 'WAITING') {
      nextResponse = {
        isPinocoWin: true,
        pinoco: newGameState.pinocoId,
        isGuessed: false,
        guessingWord: '',
      };
    }

    return {
      shouldProcessVote: true,
      voteResult: {
        nextPhase: newGameState.phase,
        voteResponse,
        nextResponse,
      },
    };
  }

  submitGuess(gsid: string, userId: string, word: string): Istart_ending {
    const gameState = this.gameService.submitGuess(gsid, userId, word);

    return {
      isPinocoWin: gameState.isPinocoWin,
      pinoco: gameState.pinocoId,
      isGuessed: true,
      guessingWord: gameState.guessingWord,
    };
  }
}
