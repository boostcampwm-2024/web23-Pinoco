import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '@/states/store/chatStore';

interface ChatMessage {
  usid: string;
  message: string;
}

export const useSocket = (url: string, gsid: string, usid: string) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);

  useEffect(() => {
    const socket: Socket = io(url);

    // 방에 참여
    socket.emit('join_room', { gsid, usid });

    // 기존 채팅 기록 수신
    socket.on('join_room_success', (data) => {
      setMessages(data.chatHistory);
    });

    // 새로운 메시지 수신
    socket.on('receive_message', (data: ChatMessage) => {
      addMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, gsid]);

  const sendMessage = (message: string) => {
    if (message.trim()) {
      const newMessage = { usid, message };
      addMessage(newMessage);
      socket.emit('send_message', { gsid, usid, message });
    }
  };

  return { sendMessage };
};
