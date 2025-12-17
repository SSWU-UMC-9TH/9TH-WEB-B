import React from 'react'
import Close from '../assets/close.png';
import { useDeleteMe } from './../hooks/mutations/useDeleteMe';

interface WithdrawalModalProps {
    onClose: () => void;
}

const WithdrawalModal = ({onClose}: WithdrawalModalProps) => {
    const {mutate: deleteMeMutate} = useDeleteMe();

    const handleDeleteMe = () => {
        deleteMeMutate();
        onClose();
    }

    return (
        <div className='p-[70px] z-20 rounded-lg bg-[#474747] flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-[20px]'>
            <button 
                className='absolute top-[20px] right-[20px] cursor-pointer'
                onClick={onClose}
            >
                <img 
                    src={Close} 
                    alt="닫기 아이콘" 
                    className='w-[20px]'
                />
            </button>
            <p className='text-white'>정말 탈퇴하시겠습니까?</p>
            <div className='flex gap-[30px] flex justify-around'>
                <button
                    onClick={handleDeleteMe}
                    className='bg-[#ffffff] rounded-lg w-[70px] h-[30px] text-black cursor-pointer'
                >
                    예
                </button>
                <button
                    onClick={onClose}
                    className='bg-[#ea00b1] rounded-lg w-[70px] h-[30px] text-white cursor-pointer'
                >
                    아니오
                </button>
            </div>
        </div>
    )
}

export default WithdrawalModal
