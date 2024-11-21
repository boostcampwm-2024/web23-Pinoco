export type GamePhase =
  | 'WAITING'
  | 'GAMESTART'
  | 'SPEAKING'
  | 'VOTING'
  | 'GUESSING'
  | 'ENDING';

export interface IGameState {
  phase: GamePhase;
  word?: string;
  pinocoId?: string;
  currentSpeakerId?: string;
  speakerQueue: string[];
  votes: Record<string, string>;
  isGuessed?: boolean;
  guessingWord?: string;
}

export interface IGameInfo extends IGameState {
  gsid: string;
  isPinoco?: boolean;
}
