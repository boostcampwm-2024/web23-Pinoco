import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatStore } from '@/states/store/chatStore';

interface IChatMessage {
  usid: string;
  message: string;
}

export const useChatSocket = (url: string, gsid: string, usid: string) => {
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);

  const socket = io(url);

  useEffect(() => {
    // 방에 참여
    socket.emit('join_room', { gsid, usid });

    // 기존 채팅 기록 수신
    socket.on('join_room_success', (data) => {
      setMessages(data.chatHistory);
    });

    // 새로운 메시지 수신
    socket.on('receive_message', (data: IChatMessage) => {
      addMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [gsid, usid]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMessage = { usid, message };
    addMessage(newMessage);
    socket.emit('send_message', { gsid, usid, message });
  };

  return { sendMessage };
};
