import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(true);
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-2xl bg-white shadow-lg w-96 max-w-lg p-8">
        {' '}
        {image && (
          <div className="mb-6 flex justify-center">
            <img src={image} alt="Modal Image" className="rounded-lg h-24 w-24" />
          </div>
        )}
        <h2 className="text-gray-900 font-semibold text-xl mb-4 text-center">{title}</h2>
        {subtitle && <p className="text-gray-800 display-medium16 mb-4 text-left">{subtitle}</p>}
        {textForm && (
          <input
            type="text"
            placeholder={textForm}
            className="display-medium14 mb-6 w-full border-b-2 py-2 text-left text-gray-700 placeholder-gray-500 focus:outline-none"
          />
        )}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="rounded-lg w-32 py-2 text-black border border-black hover:bg-gray-100"
          >
            취소
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="rounded-lg text-grayscale-white w-32 bg-black py-2 hover:bg-gray-800"
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
