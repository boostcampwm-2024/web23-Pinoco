import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

interface INicknameModalProps {
  onConfirm: (nickname: string) => void;
  onClose: () => void;
}

export default function NicknameModal({ onConfirm, onClose }: INicknameModalProps) {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleConfirm = async () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 10) {
      setErrorMessage('닉네임은 2자 이상 10자 이하로 입력해주세요.');
      return;
    }

    setErrorMessage('');
    try {
      await onConfirm(nickname.trim());
    } catch (error) {
      setErrorMessage('닉네임 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleClose = () => {
    setNickname('');
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-lg p-8 bg-white shadow-lg rounded-2xl w-96">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">닉네임 설정</h2>
        <input
          ref={inputRef}
          type="text"
          aria-label="닉네임 입력"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full py-2 mb-2 text-left text-gray-700 placeholder-gray-500 border-b-2 focus:outline-none"
        />
        {errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleClose}
            className="w-32 py-2 text-black border border-black rounded-lg hover:bg-gray-100"
            aria-label="닉네임 설정 취소"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="w-32 py-2 bg-black rounded-lg text-white-default hover:bg-gray-800"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('portal-root') as HTMLElement,
  );
}
