import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuthStore } from '@/states/store/authStore';
import { useChatStore } from '@/states/store/chatStore';

export default function ChatSection() {
  const { gsid } = useParams();
  const { userId } = useAuthStore();
  const { chatHistory } = useChatStore();
  const { sendChatEntry } = useChatSocket(gsid!, userId!);
  const [chatInput, setChat] = useState('');

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendChatEntry(chatInput);
    setChat('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4 bg-black rounded-lg opacity-80 text-white-default">
      <div className="h-56 mt-2 space-y-2 overflow-y-auto grow">
        {chatHistory.map((entry, index) => (
          <div key={index} className="text-sm">
            <span className="font-semibold">{entry.userId}</span>: {entry.message}
          </div>
        ))}
      </div>
      <input
        className="w-full p-2 mt-4 bg-gray-600 rounded-lg outline-none"
        placeholder="채팅을 입력해주세요..."
        value={chatInput}
        onChange={(e) => setChat(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
