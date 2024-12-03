import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { GameService } from '../game/game.service';
import {
  IGameState,
  GamePhase,
  IStartGameResponse,
  Istart_speaking,
  Ireceive_vote_result,
  Istart_guessing,
  Istart_ending,
} from '../game/types/game.types';
import {
  Iuser_left,
  Ijoin_room_success,
  Iupdate_ready,
  Iuser_joined,
  Icreate_room_success,
  Ireceive_message,
  IRoomInfo,
} from '../room/types/room.types';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types/socket.types';

@Injectable()
export class GatewayService {
  constructor(
    private readonly authService: AuthService,
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) {}

  validateConnection(userId: string, password: string): boolean {
    return this.authService.isValidGuest(userId, password);
  }

  handleDisconnection(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left {
    const room = this.roomService.leaveRoom(userId, gsid, client);
    return {
      userId,
      hostUserId: room.hostUserId,
    };
  }

  handleLeaveRoom(
    gsid: string,
    userId: string,
    client: AuthenticatedSocket,
  ): Iuser_left {
    const room = this.roomService.leaveRoom(userId, gsid, client);
    return {
      userId,
      hostUserId: room.hostUserId,
    };
  }

  createRoom(userId: string): Icreate_room_success {
    const room = this.roomService.createRoom(userId);
    return {
      gsid: room.gsid,
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
    const room = this.roomService.joinRoom(userId, gsid, client);

    return {
      joinRoomData: {
        userIds: Array.from(room.userIds),
        readyUserIds: Array.from(room.readyUserIds),
        isHost: room.hostUserId === userId,
        hostUserId: room.hostUserId,
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
    this.roomService.createMessage(userId, message, gsid, server);
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
    const room = this.roomService.handleReady(gsid, userId, isReady, server);
    return {
      readyUsers: Array.from(room.readyUserIds),
    };
  }

  getRoomInfo(gsid: string): IRoomInfo {
    return this.roomService.getRoom(gsid);
  }

  getGameState(gsid: string): IGameState {
    return this.gameService.getGameState(gsid);
  }

  startGame(gsid: string, userId: string): IStartGameResponse {
    const gameState = this.gameService.startGame(gsid);
    const userSpecificData: IStartGameResponse['userSpecificData'] = {};

    gameState.userIds.forEach((uid) => {
      const isPinoco = gameState.pinocoId === uid;
      userSpecificData[uid] = {
        isPinoco,
        theme: gameState.theme,
        word: isPinoco ? '' : gameState.word,
        speakerId: gameState.speakerQueue[0],
        allUserIds: gameState.userIds,
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

    if (Object.keys(gameState.votes).length !== gameState.liveUserIds.length) {
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
    } else if (newGameState.phase === 'ENDING') {
      this.gameService.endGame(gsid);
      nextResponse = {
        isPinocoWin: false,
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
        delay: 3000,
      },
    };
  }

  submitGuess(gsid: string, userId: string, word: string): Istart_ending {
    const gameState = this.gameService.submitGuess(gsid, userId, word);

    const response: Istart_ending = {
      isPinocoWin: gameState.isPinocoWin,
      pinoco: gameState.pinocoId,
      isGuessed: true,
      guessingWord: gameState.guessingWord,
    };

    this.gameService.endGame(gsid);
    return response;
  }
}
