import { useEffect } from 'react';
import { useChatStore } from '@/states/store/chatStore';
import { useSocketStore } from '@/states/store/socketStore';
import { useRoomStore } from '@/states/store/roomStore';
import { ChatType } from '@/constants/chatState';
import { useAuthStore } from '@/states/store/authStore';

interface IChatEntry {
  userId: string;
  message: string;
}

interface IUserLeft {
  userId: string;
  hostUserId: string;
}

interface IUserJoined {
  userId: string;
}

export const useChatSocket = (gsid: string, userId: string) => {
  const { userId: myUserId } = useAuthStore();
  const addChatEntry = useChatStore((state) => state.addChatEntry);
  const { addUser, removeUser, setIsHost } = useRoomStore();
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data: IChatEntry) => {
      addChatEntry({
        userId: data.userId,
        message: data.message,
        chatType: data.userId === myUserId ? ChatType.MY_CHAT : ChatType.OTHER_CHAT,
      });
    });

    socket.on('user_left', (data: IUserLeft) => {
      removeUser(data.userId);
      if (data.hostUserId === userId) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
      addChatEntry({
        userId: `[알림]`,
        message: `${data.userId}님이 퇴장하셨습니다.`,
        chatType: ChatType.NOTICE,
      });
    });

    socket.on('user_joined', (data: IUserJoined) => {
      addUser(data.userId);
      addChatEntry({
        userId: `[알림]`,
        message: `${data.userId}님이 입장하셨습니다.`,
        chatType: ChatType.NOTICE,
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_left');
      socket.off('user_joined');
    };
  }, [gsid, socket, addChatEntry, addUser, removeUser, setIsHost, userId, myUserId]);

  const sendChatEntry = (message: string) => {
    if (!socket || !message.trim()) return;

    // 서버로 메시지 전송
    socket.emit('send_message', { gsid, message });
  };

  return { sendChatEntry };
};
