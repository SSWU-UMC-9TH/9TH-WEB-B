import React, { useState } from 'react'
import type { Comment } from '../../types/lps';
import KebabMenu from '../../assets/kebab-menu.png';
import Pen from '../../assets/pen.png';
import Garbagecan from '../../assets/garbagecan.png';
import DefaultUser from '../../assets/default-user.png';
import { useAuth } from '../../context/AuthContext';
import useGetMyInfo from '../../hooks/queries/useGetMyInfo';
import { useDeleteComment } from '../../hooks/mutations/useDeleteComment';
import { useUpdateComment } from '../../hooks/mutations/useUpdateComment';
import { Check } from 'lucide-react';

interface LpCommentProps {
    comment: Comment,
}

const LpComment = ({comment}: LpCommentProps) => {
    console.log('댓글', comment);

    const {accessToken} = useAuth();
    const {data: me} = useGetMyInfo(accessToken);

    const [isButtonOpen, setIsButtonOpen] = useState(false);
    const {mutate: deleteCommentMutate} = useDeleteComment();

    const [isCommentEditing, setIsCommentEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const {mutate: updateCommentMutate} = useUpdateComment();

    const handleButtonOpen = () => {
        setIsButtonOpen(prev => !prev);
    }

    const handleUpdatecomment = () => {
        if (editedContent === '') {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        updateCommentMutate({
            lpId: comment.lpId,
            commentId: comment.id,
            content: editedContent
        })
        setIsCommentEditing(false);
    }

    const handleDeleteComment = () => {
        deleteCommentMutate({
            lpId: comment.lpId,
            commentId: comment.id,
        })
        setIsButtonOpen(false);
    }

    
    return (
        <div className='flex flex-col items-start w-full'>
            <div className='flex items-center'>
                <img 
                    src={comment.author.avatar || DefaultUser}
                    alt={comment.author.name}
                    className='w-[30px] h-[30px] rounded-full object-cover mr-[10px]'
                />
                <h4>{comment.author.name}</h4>
            </div>
            <div className='flex justify-between w-full items-start gap-2'>
                {isCommentEditing ? (
                    <input 
                        type="text" 
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className='text-sm ml-[40px] flex-1 '
                    />
                ) : (
                    <p className='text-sm whitespace-pre-wrap ml-[40px] flex-1 break-words overflow-auto'>{comment.content}</p>
                )}
                {me?.data.email===comment.author.email && (
                    <div 
                        className='cursor-pointer relative flex-shrink-0 '
                        onClick={handleButtonOpen}
                        role="button"
                    >
                        {isCommentEditing ? (
                            <Check onClick={handleUpdatecomment}/>
                        ) : (
                            <>
                                <img 
                                    src={KebabMenu} 
                                    alt="케밥 메뉴 아이콘" 
                                    className='w-[15px]'
                                />
                                {isButtonOpen && (
                                    <div className='absolute top-full left-0 z-10 flex gap-2 bg-[#282828] p-[10px] w-[60px]'>
                                        <button onClick={() => {
                                            setIsCommentEditing(true);
                                            setIsButtonOpen(false);
                                        }}>
                                            <img 
                                                src={Pen} 
                                                alt="수정 아이콘" 
                                                className='cursor-pointer'
                                            />
                                        </button>
                                        <button onClick={handleDeleteComment}>
                                            <img 
                                                src={Garbagecan} 
                                                alt="삭제 아이콘" 
                                                className='cursor-pointer'
                                            />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LpComment
