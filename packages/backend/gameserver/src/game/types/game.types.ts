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
  isGuessed?: boolean;
}

export interface IGameInfo extends IGameState {
  gsid: string;
  isPinoco?: boolean;
}
