import ReactDOM from 'react-dom';

interface ILeaveConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function LeaveConfirmModal({ onConfirm, onClose }: ILeaveConfirmModalProps) {
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-lg p-8 bg-white shadow-lg rounded-2xl w-96">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">
          게임을 나가시겠습니까?
        </h2>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="w-32 py-2 text-black border border-black rounded-lg hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
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
