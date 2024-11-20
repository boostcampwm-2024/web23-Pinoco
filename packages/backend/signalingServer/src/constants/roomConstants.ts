export const ROOM_CONSTANTS = {
  maxParticipants: 6,
} as const;

export const ROOM_ERROR_MESSAGES = {
  notFound: '존재하지 않는 방입니다.',
  full: '방이 가득 찼습니다.',
  alreadyExists: '이미 존재하는 방입니다.',
} as const;
