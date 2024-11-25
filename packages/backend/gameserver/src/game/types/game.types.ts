export type GamePhase =
  | 'WAITING'
  | 'GAMESTART'
  | 'SPEAKING'
  | 'VOTING'
  | 'GUESSING'
  | 'ENDING';

export interface IGameState {
  phase: GamePhase;
  userIds: string[];
  word?: string;
  pinocoId?: string;
  speakerQueue: string[];
  votes: Record<string, string>;
  isGuessed?: boolean;
  guessingWord?: string;
}

export interface IGameInfo extends IGameState {
  gsid: string;
  isPinoco?: boolean;
}
