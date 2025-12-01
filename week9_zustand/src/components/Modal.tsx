import useModalStore from "../hooks/useModalStore";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);
  const { clearCart } = useCartActions();

  if (!isOpen) return null;

  const handleYes = () => {
    clearCart();
    closeModal();
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded shadow">
        <p>정말 삭제하시겠습니까?</p>
        <div className="flex gap-4 mt-4 ml-7">
          <button onClick={handleYes} className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer">네</button>
          <button onClick={handleNo} className="px-4 py-2 bg-gray-300 rounded cursor-pointer">아니요</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;