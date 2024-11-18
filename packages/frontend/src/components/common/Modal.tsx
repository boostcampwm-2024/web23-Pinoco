import ReactDOM from 'react-dom';

interface IModalProps {
  title: string;
  subtitle?: string;
  textForm?: string;
  image?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function Modal({
  title,
  subtitle,
  textForm,
  image,
  onClose,
  onConfirm,
}: IModalProps) {
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-lg p-8 bg-white shadow-lg rounded-2xl w-96">
        {' '}
        {image && (
          <div className="flex justify-center mb-6">
            <img src={image} alt="Modal Image" className="w-24 h-24 rounded-lg" />
          </div>
        )}
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">{title}</h2>
        {subtitle && <p className="mb-4 text-left text-gray-800 display-medium16">{subtitle}</p>}
        {textForm && (
          <input
            type="text"
            placeholder={textForm}
            className="w-full py-2 mb-6 text-left text-gray-700 placeholder-gray-500 border-b-2 display-medium14 focus:outline-none"
          />
        )}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="w-32 py-2 text-black border border-black rounded-lg hover:bg-gray-100"
          >
            취소
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="w-32 py-2 bg-black rounded-lg text-grayscale-white hover:bg-gray-800"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(modalContent, document.getElementById('portal-root') as HTMLElement);
}
