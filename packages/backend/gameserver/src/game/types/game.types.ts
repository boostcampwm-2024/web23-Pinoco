export type GamePhase = 'WAITING' | 'SPEAKING' | 'VOTING' | 'GUESSING';

export interface IGameState {
  gsid: string;
  phase: GamePhase;
  userIds: Set<string>;
  readyUserIds: Set<string>;
  hostUserId: string;
  word?: string;
  theme?: string;
  pinocoId?: string;
  liveUserIds?: string[];
  speakerQueue?: string[];
  votes?: Record<string, string>;
  guessingWord?: string;
  isPinocoWin?: boolean;
  voteResult?: {
    voteCount: Record<string, number>;
    deadPerson: string;
    isDeadPersonPinoco: boolean;
  };
}

export interface Istart_game_success {
  userSpecificData: {
    [userId: string]: {
      isPinoco: boolean;
      theme: string;
      word: string;
      speakerId: string;
      allUserIds: string[];
    };
  };
}

export interface Ireceive_message {
  userId: string;
  message: string;
  timestamp: number;
}

export interface Istart_speaking {
  speakerId: string;
}

export interface Ireceive_vote_result {
  voteResult: {
    [userId: string]: number;
  };
  deadPerson: string;
  isDeadPersonPinoco: boolean;
}

export interface Istart_guessing {
  guessingUserId: string;
}

export interface Icreate_room_success {
  gsid: string;
  isHost: boolean;
}

export interface Ijoin_room_success {
  userIds: string[];
  readyUserIds: string[];
  isHost: boolean;
  hostUserId: string;
}

export interface Iuser_left {
  userId: string;
  hostUserId: string;
}

export interface Iuser_joined {
  userId: string;
}

export interface Iupdate_ready {
  readyUsers: string[];
}

export interface Istart_ending {
  isPinocoWin: boolean;
  pinoco: string;
  isGuessed: boolean;
  guessingWord: string;
}
