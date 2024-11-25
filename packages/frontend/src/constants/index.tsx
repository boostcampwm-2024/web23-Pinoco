export const GAME_PHASE = {
  WAITING: 'waiting', // 게임시작 전 대기 상태
  COUNTDOWN: 'countdown', // 게임시작 카운트다운 상태
  WORD_REVEAL: 'word-reveal', // 제시어 공개 상태
  SPEAKING: 'speaking', // 발언 상태
  VOTING: 'voting', // 투표 상태
  VOTING_RESULT: 'voting-result', // 투표 결과 상태
  GUESSING: 'guessing', // 피노코가 제시어를 맞추는 페이즈
  ENDING: 'ending', // 게임 종료 페이즈 (피노코 승/제페토 승 결과 표시)
} as const;

export type GamePhase = (typeof GAME_PHASE)[keyof typeof GAME_PHASE];
