import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message, confirmText = '예', cancelText = '아니오', isPending }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 items-center">
        <p className="text-lg text-center">{message}</p>
        <div className="flex gap-4 mt-2">
          <button
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 disabled:bg-gray-400"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : confirmText}
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
