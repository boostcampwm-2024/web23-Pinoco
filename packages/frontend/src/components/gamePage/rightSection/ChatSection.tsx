import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuthStore } from '@/states/store/authStore';
import { useChatStore } from '@/states/store/chatStore';
import { ChatType } from '@/constants/chatState';
import ArrowDownIcon from '@/assets/images/ArrowDownIcon.svg?react';

export default function ChatSection() {
  const { gsid } = useParams();
  const { userId } = useAuthStore();
  const { chatHistory } = useChatStore();
  const { sendChatEntry } = useChatSocket(gsid!, userId!);

  const [chatInput, setChat] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    if (!chatInput.trim() || isComposing) return;
    sendChatEntry(chatInput);
    setChat('');
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    setChat(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4 bg-black rounded-lg opacity-80 text-white-default">
      <div className="h-56 mt-2 space-y-2 overflow-y-auto grow">
        {chatHistory.map((entry, index) => (
          <div
            key={entry.userId + index}
            className={`flex flex-col ${
              entry.chatType === ChatType.MY_CHAT
                ? 'items-end'
                : entry.chatType === ChatType.NOTICE
                  ? 'items-center'
                  : 'items-start'
            }`}
          >
            {entry.chatType !== ChatType.NOTICE && (
              <span className="mb-1 font-semibold">{entry.userId}</span>
            )}
            <div
              className={`px-3 py-2 rounded-lg ${
                entry.chatType === ChatType.MY_CHAT
                  ? 'bg-white text-black'
                  : entry.chatType === ChatType.NOTICE
                    ? 'bg-black text-white-default'
                    : 'bg-gray-600 text-white'
              } ${entry.chatType === ChatType.NOTICE ? 'text-center' : ''}`}
            >
              {entry.chatType === ChatType.NOTICE ? entry.message : <span>{entry.message}</span>}
            </div>
          </div>
        ))}
        <ArrowDownIcon className="p-2 bg-gray-500 rounded-full opacity-70 size-8 text-white-default" />
      </div>
      <input
        className="w-full p-2 mt-4 bg-gray-600 rounded-lg outline-none"
        placeholder="채팅을 입력해주세요..."
        value={chatInput}
        onChange={(e) => setChat(e.target.value)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
