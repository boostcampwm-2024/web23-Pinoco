export type GamePhase =
  | 'GAMESTART'
  | 'SPEAKING'
  | 'VOTING'
  | 'GUESSING'
  | 'ENDING';

export interface IGameState {
  phase: GamePhase;
  userIds: string[];
  word: string;
  theme: string;
  pinocoId: string;
  liveUserIds: string[];
  speakerQueue: string[];
  votes: Record<string, string>;
  guessingWord?: string;
  isPinocoWin?: boolean;
  voteResult?: {
    voteCount: Record<string, number>;
    deadPerson: string;
    isDeadPersonPinoco: boolean;
  };
}

export interface IStartGameResponse {
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

export interface Istart_ending {
  isPinocoWin: boolean;
  pinoco: string;
  isGuessed: boolean;
  guessingWord: string;
}
