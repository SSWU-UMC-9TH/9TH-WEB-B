import React from 'react'
import Plus from '../assets/plus.png'

interface FloatingButtonProps {
    onClick: () => void;
}

const FloatingButton = ({onClick}: FloatingButtonProps) => {

    return (
        <button
            className='bg-[#ea00b1] w-[40px] h-[40px] rounded-full flex items-center justify-center
            fixed bottom-[30px] right-[20px] hover:bg-[#bf008f] cursor-pointer z-10'
            onClick={onClick}
        >
            <img 
                className='w-[30px]'
                src={Plus} 
                alt="더하기 아이콘" 
            />
        </button>
    )
}

export default FloatingButton
