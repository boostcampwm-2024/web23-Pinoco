import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useSocketStore } from '@/store/socketStore';
import { useRoomStore } from '@/store/roomStore';
import { ChatType } from '@/constants/chatState';
import { useAuthStore } from '@/store/authStore';

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
  const { addUser, removeUser, setHostUserId, setIsHost, removeReadyUser } = useRoomStore();
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
      setHostUserId(data.hostUserId);

      removeReadyUser(data.hostUserId);
      console.log('준비유저 업데이트 완료');

      addChatEntry({
        userId: `[알림]`,
        message: `${data.userId}님이 퇴장하셨습니다.`,
        chatType: ChatType.NOTICE,
      });

      if (data.hostUserId === myUserId) {
        setIsHost(true);
        addChatEntry({
          userId: `[알림]`,
          message: `방장이 변경되었습니다. 당신이 새로운 방장입니다.`,
          chatType: ChatType.NOTICE,
        });
      } else {
        setIsHost(false);
      }
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
  }, [
    gsid,
    socket,
    addChatEntry,
    addUser,
    removeUser,
    setHostUserId,
    setIsHost,
    myUserId,
    removeReadyUser,
  ]);

  const sendChatEntry = (message: string) => {
    if (!socket || !message.trim()) return;

    socket.emit('send_message', { gsid, message });
  };

  return { sendChatEntry };
};
