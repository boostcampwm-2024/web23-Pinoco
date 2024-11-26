import { useState } from 'react';

interface IGuessInputProps {
  onSubmitGuess: (word: string) => void;
}

export default function GuessInput({ onSubmitGuess }: IGuessInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSubmitGuess(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-white-default">제시어를 추리하여 입력해주세요 !</h2>
      <input
        type="text"
        placeholder="제시어 입력"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="p-2 text-lg rounded-md bg-gray-800 text-white-default outline-none"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-2 text-lg font-bold text-white-default bg-green-default rounded-md"
      >
        제출
      </button>
    </div>
  );
}
