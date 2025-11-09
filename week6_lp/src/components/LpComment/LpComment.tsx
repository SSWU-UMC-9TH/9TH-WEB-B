import React from 'react'
import type { Comment } from '../../types/lps'

interface LpCommentProps {
    comment: Comment,
}

const LpComment = ({comment}: LpCommentProps) => {
    console.log('댓글', comment);
    
    return (
        <div className='flex flex-col items-start w-full'>
            <div className='flex items-center'>
                <img 
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className='w-[30px] h-[30px] rounded-full object-cover mr-[10px]'
                />
                <h4>{comment.author.name}</h4>
            </div>
            <p className='text-sm whitespace-pre-wrap ml-[40px]'>{comment.content}</p>
        </div>
    )
}

export default LpComment
