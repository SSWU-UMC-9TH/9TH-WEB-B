import { useSelector, useDispatch } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/CartSlice";
import { closeModal } from "../slices/ModalSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  if (!isOpen) return null;

  const handleYes = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  const handleNo = () => {
    dispatch(closeModal());
  };

  return (
    <div className="bg-black/60 fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
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