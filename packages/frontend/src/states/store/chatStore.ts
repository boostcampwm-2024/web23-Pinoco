import { create } from 'zustand';

interface IChatMessage {
  usid: string;
  message: string;
}

interface ChatState {
  messages: IChatMessage[];
  addMessage: (message: IChatMessage) => void;
  setMessages: (messages: IChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));
