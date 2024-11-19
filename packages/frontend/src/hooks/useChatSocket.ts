import { useEffect } from 'react';
import { useChatStore } from '@/states/store/chatStore';
import { useSocketStore } from '@/states/store/socketStore';


interface IChatEntry {
  userId: string;
  message: string;
}

export const useChatSocket = (gsid: string, userId: string) => {
  const addChatEntry = useChatStore((state) => state.addChatEntry);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data: IChatEntry) => {
      addChatEntry(data);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [gsid, socket]);

  const sendChatEntry = (message: string) => {
    if (!socket || !message.trim()) return;
    const newEntry = { userId, message };
    addChatEntry(newEntry);
    socket.emit('send_message', { gsid, message });
  };

  return { sendChatEntry };
};
