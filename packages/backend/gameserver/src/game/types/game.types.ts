export type GamePhase =
  | 'WAITING'
  | 'GAMESTART'
  | 'SPEAKING'
  | 'VOTING'
  | 'GUESSING'
  | 'ENDING';

export interface GameState {
  phase: GamePhase;
  word?: string;
  pinocoId?: string;
  currentSpeakerId?: string;
  speakerQueue: string[];
  votes: Record<string, string>;
  isGuessed?: boolean;
  guessingWord?: string;
}

export interface GameInfo extends GameState {
  gsid: string;
  isPinoco?: boolean;
}
