import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/states/store/authStore';
import { useChatStore } from '@/states/store/chatStore';

export default function ChatSection() {
  const { gsid } = useParams();
  const usid = useAuthStore((state) => state.usid);
  const { messages } = useChatStore();
  const { sendMessage } = useSocket('http://localhost:3000', gsid!, usid!);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-grow p-4 bg-black rounded-lg opacity-80 text-white-default">
      <div className="h-56 mt-2 space-y-2 overflow-y-auto grow">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm">
            <span className="font-semibold">{msg.usid}</span>: {msg.message}
          </div>
        ))}
      </div>
      <input
        className="w-full p-2 mt-4 bg-gray-600 rounded-lg outline-none"
        placeholder="채팅을 입력해주세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}
