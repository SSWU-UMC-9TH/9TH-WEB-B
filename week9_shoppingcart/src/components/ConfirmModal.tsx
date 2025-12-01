import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useCustomRedux';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart, removeItem, calculateTotals } from '../features/cart/cartSlice';

const ConfirmModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const deleteId = useAppSelector((state) => state.modal.deleteId);

  if (!isOpen) return null;

  const handleNo = () => {
    dispatch(closeModal());
  };

  const handleYes = () => {
    if (deleteId) {
      dispatch(removeItem({ id: deleteId }));
    } else {
      dispatch(clearCart());
    }
    dispatch(calculateTotals());
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg p-8 z-10 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">정말 모든 장바구니를 삭제하시겠습니까?</h2>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleNo}
          >
            아니요
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleYes}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
