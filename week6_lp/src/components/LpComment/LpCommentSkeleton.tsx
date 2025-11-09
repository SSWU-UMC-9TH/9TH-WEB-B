export const LpCommentSkeleton = () => {
    return (
        <div className='flex flex-col items-start animate-pulse'>
            <div className='flex items-center mb-1'>
                <div className='w-[30px] h-[30px] rounded-full object-cover mr-[10px] bg-[#777777]'></div>
                <div className='w-[40px] h-[24px] bg-[#777777] rounded-lg'></div>
            </div>
            <div className='w-full h-[24px] bg-[#777777] rounded-lg ml-[40px]'></div>
        </div>
    )
}