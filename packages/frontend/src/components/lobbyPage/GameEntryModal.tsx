import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

interface IGameEntryModalProps {
  title: string;
  subtitle?: string;
  textForm?: string;
  onConfirm: (gsid: string) => void;
  onClose: () => void;
}

export default function GameEntryModal({
  title,
  subtitle,
  textForm,
  onConfirm,
  onClose,
}: IGameEntryModalProps) {
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('modalTooltipShown')) {
      setShowTooltip(true);
      localStorage.setItem('modalTooltipShown', 'true');
    }
  }, []);

  const handleConfirm = () => {
    if (gameCode.trim()) {
      setErrorMessage('');
      onConfirm(gameCode);
    } else {
      setErrorMessage('게임 코드를 입력해주세요.');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div id="modal-tooltip-anchor" className="max-w-lg p-8 bg-white shadow-lg rounded-2xl w-96">
        {showTooltip && (
          <Tooltip
            key="modal-tooltip"
            anchorId="modal-tooltip-anchor"
            place="top"
            content="방에 들어가있는 친구에게 game/ 뒤의 코드를 공유받으세요!"
            isOpen
            style={{
              backgroundColor: '#B4C25D',
              color: '#000000',
              borderRadius: '0.5rem',
            }}
          />
        )}
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">{title}</h2>
        {subtitle && <p className="mb-4 text-left text-gray-800">{subtitle}</p>}
        {textForm && (
          <input
            type="text"
            placeholder={textForm}
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className="w-full py-2 mb-2 text-left text-gray-700 placeholder-gray-500 border-b-2 focus:outline-none"
          />
        )}
        {errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="w-32 py-2 text-black border border-black rounded-lg hover:bg-gray-100"
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
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('portal-root') as HTMLElement);
}
