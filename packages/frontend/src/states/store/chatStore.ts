import { ChatType } from '@/constants/chatState';
import { create } from 'zustand';

interface IChatEntry {
  userId: string;
  message: string;
  chatType: ChatType;
}

interface IChatState {
  chatHistory: IChatEntry[];
  addChatEntry: (entry: IChatEntry) => void;
  setChatHistory: (history: IChatEntry[]) => void;
}

export const useChatStore = create<IChatState>((set) => ({
  chatHistory: [],
  addChatEntry: (entry) => set((state) => ({ chatHistory: [...state.chatHistory, entry] })),
  setChatHistory: (history) => set({ chatHistory: history }),
}));
