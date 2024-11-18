import { create } from 'zustand';

interface IChatMessage {
  userId: string;
  message: string;
}

interface IChatState {
  messages: IChatMessage[];
  addMessage: (message: IChatMessage) => void;
  setMessages: (messages: IChatMessage[]) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));
