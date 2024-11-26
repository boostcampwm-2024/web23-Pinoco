import React, { useState, useEffect, useRef } from 'react';
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    if (!isScrolledUp && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isScrolledUp]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - clientHeight - scrollTop <= 50;
    setIsScrolledUp(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setIsScrolledUp(false);
    }
  };

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
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="relative h-56 mt-2 space-y-2 overflow-y-auto grow"
      >
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
      </div>
      {isScrolledUp && (
        <div className="relative">
          <button onClick={scrollToBottom} className="absolute z-50 bottom-8 right-6">
            <ArrowDownIcon className="p-2 transition-all bg-gray-500 rounded-full size-8 text-white-default hover:opacity-100 hover:bg-gray-600" />
          </button>
        </div>
      )}
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
