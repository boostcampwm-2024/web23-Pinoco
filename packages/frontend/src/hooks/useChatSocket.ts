import { useEffect } from 'react';
import { useChatStore } from '@/states/store/chatStore';
import { useSocketStore } from '@/states/store/socketStore';

interface IChatMessage {
  userId: string;
  message: string;
}

export const useChatSocket = (gsid: string, userId: string) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    // 기존 채팅 기록 수신
    socket.on('join_room_success', (data) => {
      setMessages(data.chatHistory);
    });

    // 새로운 메시지 수신
    socket.on('receive_message', (data: IChatMessage) => {
      addMessage(data);
    });

    return () => {
      socket.off('join_room_success');
      socket.off('receive_message');
    };
  }, [gsid, socket]);

  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) return;
    const newMessage = { userId, message };
    addMessage(newMessage);
    socket.emit('send_message', { gsid, userId, message });
  };

  return { sendMessage };
};
