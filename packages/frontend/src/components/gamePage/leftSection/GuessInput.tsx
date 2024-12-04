import { useState, useCallback, memo } from 'react';

interface IGuessInputProps {
  onSubmitGuess: (word: string) => void;
}

const GuessInput = memo(function GuessInput({ onSubmitGuess }: IGuessInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    onSubmitGuess(inputValue);
    setInputValue('');
  }, [inputValue, onSubmitGuess]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-white-default">제시어를 추리하여 입력해주세요 !</h2>
      <input
        type="text"
        placeholder="제시어 입력"
        value={inputValue}
        onChange={handleChange}
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
});

export default GuessInput;
