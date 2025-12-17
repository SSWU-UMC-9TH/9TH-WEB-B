import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetLpDetail } from './../hooks/queries/useGetLpDetail';
import Pen from '../assets/pen.png';
import Garbagecan from '../assets/garbagecan.png';
import Picture from '../assets/picture.png';
import Close from '../assets/close.png';
import DefaultUser from '../assets/default-user.png';
import {Check, Heart} from 'lucide-react';
import { PAGINATION_ORDER } from '../enums/common';
import { useInView } from 'react-intersection-observer';
import LpComment from '../components/LpComment/LpComment';
import LpCommentSkeletonList from '../components/LpComment/LpCommentSkeletonList';
import { useGetInfiniteLpCommentList } from '../hooks/queries/useGetInfiniteLpCommentList';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import { useAuth } from '../context/AuthContext';
import usePostLike from '../hooks/mutations/usePostLike';
import useDeleteLike from '../hooks/mutations/useDeleteLike';
import { usePostComment } from '../hooks/mutations/usePostComment';
import { useDeleteLp } from '../hooks/mutations/useDeleteLp';
import { useUpdateLp } from '../hooks/mutations/useUpdateLp';

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const {accessToken} = useAuth();

    const [order, setOrder]  = useState(PAGINATION_ORDER.desc);
    const [commentInput, setCommentInput] = useState('');

    const id = lpId ? parseInt(lpId, 10) : 0;
    const { data: lp, isPending: isLpPending, isError: isLpError } = useGetLpDetail(id);
    console.log('LP 상세 정보:', lp);
    const {mutate: commentMutate} = usePostComment();
    
    const [isLpEditing, setIsLpEditing] = useState(false);
    const [editedLp, setEditedLp] = useState(lp?.data);
    const [lpTagInput, setLpTagInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const handleTitle = (e) => {
        setEditedLp(prev => ({
            ...(prev || {}),
            title: e.target.value
        }))
    }

    const handleContent = (e) => {
        setEditedLp(prev => ({
            ...(prev || {}),
            content: e.target.value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedLp(prev => ({ 
                    ...(prev || {}),
                    thumbnail: reader.result as string
                }));
            }
            reader.readAsDataURL(file);
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    const addTag = () => {
        if (lpTagInput && editedLp && !editedLp.tags.some(t => t.name === lpTagInput)) {
            const newTag = { name: lpTagInput }; 
            setEditedLp(prev => ({
                ...(prev || {}),
                tags: [...(prev?.tags || []), newTag]
            }));
            setLpTagInput('');
        }
    };

    const deleteTag = (deleteTag) => {
        setEditedLp(prev => ({
            ...(prev || {}),
            tags: prev?.tags.filter(tag => tag.name !== deleteTag) || []
        }));
    };

    const {mutate: updateLpMutate} = useUpdateLp();
    const handleUpdateLp = () => {
        if (!editedLp || !editedLp.title || !editedLp.content) {
            alert("제목과 내용을 작성해주세요.");
            return;
        }
        setIsLpEditing(false);
        updateLpMutate({
            lpId: id,
            lp: {
                title: editedLp.title,
                content: editedLp.content,
                thumbnail: editedLp.thumbnail, 
                tags: editedLp.tags.map(t => t.name),
                published: editedLp.published,
            }
        })
    }

    useEffect(() => {
        if (lp?.data) {
            setEditedLp(lp.data);
        }
    }, [lp?.data]);

    const {mutate: deleteLpMutate} = useDeleteLp();
    const handleDeleteLp = () => {
        deleteLpMutate({
            lpId
        })
    }

    const { 
        data: comments, 
        isFetching: isCommentsFetching, 
        hasNextPage: commentsHasNextPage, 
        isPending: isCommentsPending, 
        fetchNextPage: fetchNextCommentPage, 
        isError: isCommentsError 
    } = useGetInfiniteLpCommentList(id, 10, order);

    const {data: me} = useGetMyInfo(accessToken);
    console.log('내 정보 조회', me);
    const {mutate: likeMutate} = usePostLike();
    const {mutate: dislikeMutate} = useDeleteLike();

    const isLiked = lp?.data.likes.map((like) => like.userId).includes(me?.data.id as number);

    const handleLikeLp = () => {
        likeMutate({lpId: Number(lpId)});
    }

    const handleDislikeLp = () => {
        dislikeMutate({lpId: Number(lpId)});
    }

    const { ref: commentRef, inView: commentsInView } = useInView({ threshold: 0 });

    useEffect(() => {
        if (commentsInView) {
            !isCommentsFetching && commentsHasNextPage && fetchNextCommentPage();
        }
    }, [commentsInView, isCommentsFetching, commentsHasNextPage, fetchNextCommentPage]);
    
    const commentList = comments?.pages?.map(page => page.data.data)?.flat();
    const showInitialCommentLoading = isCommentsPending && commentList?.length === 0; 
    const showFetchingNextCommentPage = isCommentsFetching && commentsHasNextPage

    const formatRelativeTime = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}초 전`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}분 전`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)}일 전`;
        }
    }
    
    const handleOrder = (newOrder: PAGINATION_ORDER) => {
        setOrder(newOrder);
    }

    const handleCommentSubmit = () => {
        if (commentInput.length===0) {
            alert('댓글을 작성해주세요.');
            return;
        }
        commentMutate({
            lpId: id,
            content: commentInput,
        })
        setCommentInput('');
    }
    
    if (isLpPending || isCommentsPending) {
        return <div>Loading...</div>
    }

    if (isLpError || isCommentsError || !lp?.data) {
        return <div>Error loading data.</div>
    }

    return (
        <>
            <div className='bg-[#353535] rounded-lg px-[50px] py-[20px] w-full max-w-3xl mx-auto m-[20px]'>
                <header className='flex justify-between items-center mb-[20px]'>
                    <div className='flex gap-[5px] items-center'>
                        <img src={lp.data.author.avatar || DefaultUser} 
                            alt={lp.data.author.name} 
                            className='w-[30px] rounded-full h-[30px] object-cover'
                        />
                        <p>{lp.data.author.name}</p>
                    </div>
                    <p>{formatRelativeTime(lp.data.createdAt)}</p>
                </header>
                <div className='flex justify-between items-center mb-[40px] gap-2'>
                    {isLpEditing ? (
                        <input 
                            type="text" 
                            value={editedLp?.title || lp?.data.title}
                            onChange={handleTitle}
                            className='text-[18px] w-full'
                        />
                    ) : (
                        <p className='text-[18px]'>{lp.data.title}</p>
                    )}
                    {me?.data.email===lp.data.author.email && (
                        <div className='flex gap-[5px]'>
                            {isLpEditing ? (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className='hidden'
                                    />
                                    <button onClick={handleImageChange}>
                                        <img 
                                            src={Picture} 
                                            alt="사진 아이콘"
                                            className='w-[25px] cursor-pointer' 
                                            onClick={isLpEditing ? handleImageClick : undefined}
                                        />
                                    </button>
                                    <button onClick={handleUpdateLp}>
                                        <Check className='w-[25px] cursor-pointer' />
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsLpEditing(true)}>
                                    <img 
                                        src={Pen} 
                                        alt="펜 아이콘"
                                        className='w-[25px] cursor-pointer' 
                                    />
                                </button>
                            )}
                            <button onClick={handleDeleteLp}>
                                <img 
                                    src={Garbagecan} 
                                    alt="휴지통 아이콘"
                                    className='w-[25px] cursor-pointer' 
                                />
                            </button>
                        </div>
                    )}
                </div>
                <div className='shadow-xl shadow-black p-[20px] w-full max-w-lg mx-auto aspect-square'>
                    <img 
                        src={editedLp?.thumbnail || lp.data.thumbnail} 
                        alt={`${lp.data.title}의 이미지`}
                        className='rounded-full w-full h-full object-cover border border-black'
                    />
                </div>
                {isLpEditing ? (
                    <input 
                        type="text" 
                        value={editedLp?.content || lp?.data.content}
                        onChange={handleContent}
                        className='my-[30px] w-full'
                    />
                ) : (
                    <p className='mt-[30px]'>{lp.data.content}</p>
                )}
                {isLpEditing ? (
                    <>
                        <div className='flex gap-2'>
                            <input 
                                type="text" 
                                value={lpTagInput}
                                onChange={(e) => setLpTagInput(e.target.value)}
                                placeholder='LP Tag'
                                className='border border-white rounded-lg p-[5px] text-white flex-1 w-full'
                            />
                            <button 
                                className='bg-[#808080] rounded-lg text-white px-[10px] py-[5px] cursor-pointer'
                                onClick={addTag}
                            >
                                Add
                            </button>
                        </div>
                        <div className='flex gap-2 flex-wrap mt-[20px]'>
                            {editedLp?.tags.map((tag, index) => (
                                <div 
                                    key={index}
                                    className='bg-[#282828] text-white rounded-lg flex items-center gap-1 p-2 text-[10px]'
                                >
                                    #{tag.name}
                                    <button onClick={() => deleteTag(tag.name)}>
                                        <img 
                                            src={Close} 
                                            alt="닫기 아이콘" 
                                            className='w-[10px] cursor-pointer'
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='flex justify-center p-[20px] flex-wrap'>
                        {lp.data.tags.length > 0 && lp.data.tags.map((tag, index) => (
                            <div 
                                key={index}
                                className='rounded-[20px] bg-[#47445b] px-[10px] py-[5px] m-[5px]'
                            >
                                #{tag.name}
                            </div>
                        ))}
                    </div>
                )}
                <div className='flex items-center justify-center gap-1'>
                    <button onClick={isLiked ? handleDislikeLp : handleLikeLp} className='cursor-pointer'>
                        <Heart color={isLiked ? "red" : "white"} fill={isLiked ? "red" : "transparent"} />
                    </button>
                    <p>{lp.data.likes.length}</p>
                </div>
            </div>
            <div className='bg-[#353535] rounded-lg px-[50px] py-[20px] w-full max-w-3xl mx-auto m-[20px]'>
                <header className='flex justify-between items-center mb-[10px]'>
                    <p>댓글</p>
                    <div>
                        <button
                            onClick={() => handleOrder(PAGINATION_ORDER.asc)}
                            className={`border border-white rounded-l-[7px] px-[10px] py-[5px] cursor-pointer
                                ${order===PAGINATION_ORDER.asc ? 'bg-white text-black' : 'bg-black text-white'}`}
                        >
                            오래된순
                        </button>
                        <button
                            onClick={() => handleOrder(PAGINATION_ORDER.desc)}
                            className={`border border-white rounded-r-[7px] px-[10px] py-[5px] cursor-pointer
                                ${order===PAGINATION_ORDER.desc ? 'bg-white text-black' : 'bg-black text-white'}`}
                        >
                            최신순
                        </button>
                    </div>
                </header>
                <div className='flex justify-between gap-2'>
                    <input 
                        type="text" 
                        placeholder='댓글을 입력해주세요'
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className='border border-white rounded-lg px-[10px] py-[5px] flex-grow flex-1'
                    />
                    <button 
                        onClick={handleCommentSubmit}
                        className='rounded-lg px-[10px] py-[5px] bg-[#7a7a7a] cursor-pointer'
                    >
                        작성
                    </button>
                </div>
                <div className='flex flex-col mt-[20px] gap-[10px]'>
                    {showInitialCommentLoading && <LpCommentSkeletonList count={3} />}
                    {commentList?.map(comment => (
                        <LpComment key={comment.id} comment={comment} />
                    ))}
                    {showFetchingNextCommentPage && <LpCommentSkeletonList count={2} />}
                    <div ref={commentRef} className='h-1' />
                </div>
            </div>
        </>
    )
} 

export default LpDetailPage
