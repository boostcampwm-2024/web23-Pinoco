import { useEffect } from 'react';
import { useChatStore } from '@/states/store/chatStore';
import { useSocketStore } from '@/states/store/socketStore';

interface IChatMessage {
  userId: string;
  message: string;
}

export const useChatSocket = (gsid: string, userId: string) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    // 새로운 메시지 수신
    socket.on('receive_message', (data: IChatMessage) => {
      addMessage(data);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [gsid, socket]);

  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) return;
    const newMessage = { userId, message };
    addMessage(newMessage);
    socket.emit('send_message', { gsid, message });
  };

  return { sendMessage };
};
