import { useCartActions } from '../hooks/useCartStore';
import { useModalActions } from '../hooks/useModalStore';

const Modal = () => {
    const {clearCart} = useCartActions();
    const {closeModal} = useModalActions();

    const handleCloseModal = () => {
        closeModal();
    }

    const handleClearCart = () => {
        clearCart();
        closeModal();
    }

    return (
        <div className='border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-2 flex flex-col items-center justify-center bg-opacity-70 bg-white rounded-lg p-[30px] w-[300px] h-[150px]'>
            <p className='font-semibold mb-4'>정말 삭제하시겠습니까?</p>
            <div className='flex justify-center gap-2'>
                <button 
                    onClick={handleCloseModal}
                    className='bg-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 cursor-pointer'
                >
                    아니요
                </button>
                <button 
                    onClick={handleClearCart}
                    className='bg-red-500 px-2 py-1 text-white rounded-md hover:bg-red-700 cursor-pointer'
                >
                    네
                </button>
            </div>
        </div>
    )
}

export default Modal
