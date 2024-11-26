export const ChatType = {
  MY_CHAT: 'my-chat',
  OTHER_CHAT: 'other-chat',
  NOTICE: 'notice',
} as const;

export type ChatType = (typeof ChatType)[keyof typeof ChatType];
