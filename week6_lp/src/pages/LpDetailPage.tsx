import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetLpDetail } from './../hooks/queries/useGetLpDetail';
import Pen from '../assets/pen.png';
import Garbagecan from '../assets/garbagecan.png';
import HeartRed from '../assets/heart-red.png';
import { PAGINATION_ORDER } from '../enums/common';
import { useInView } from 'react-intersection-observer';
import LpComment from '../components/LpComment/LpComment';
import LpCommentSkeletonList from '../components/LpComment/LpCommentSkeletonList';
import { useGetInfiniteLpCommentList } from '../hooks/queries/useGetInfiniteLpCommentList';

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();

    const [order, setOrder] = useState(PAGINATION_ORDER.desc);
    const [commentInput, setCommentInput] = useState('');

    const id = lpId ? parseInt(lpId, 10) : 0;
    const { data: lp, isPending: isLpPending, isError: isLpError } = useGetLpDetail(id);
    console.log('LP 상세 정보:', lp);

    const { 
        data: comments, 
        isFetching: isCommentsFetching, 
        hasNextPage: commentsHasNextPage, 
        isPending: isCommentsPending, 
        fetchNextPage: fetchNextCommentPage, 
        isError: isCommentsError 
    } = useGetInfiniteLpCommentList(id, 10, order);

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
        const trimmedComment = commentInput.trim();
        if (trimmedComment.length===0) {
            alert('댓글을 작성해주세요.');
            return;
        }
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
                        <img src={lp.data.author.avatar} 
                        alt={lp.data.author.name} 
                        className='w-[30px] rounded-full'
                        />
                        <p>{lp.data.author.name}</p>
                    </div>
                    <p>{formatRelativeTime(lp.data.createdAt)}</p>
                </header>
                <div className='flex justify-between items-center mb-[40px]'>
                    <p className='text-[18px]'>{lp.data.title}</p>
                    <div className='flex gap-[5px]'>
                        <button>
                            <img 
                                src={Pen} 
                                alt="펜 아이콘"
                                className='w-[25px] cursor-pointer' 
                            />
                        </button>
                        <button>
                            <img 
                                src={Garbagecan} 
                                alt="휴지통 아이콘"
                                className='w-[25px] cursor-pointer' 
                            />
                        </button>
                    </div>
                </div>
                <div className='shadow-xl shadow-black p-[20px] w-full max-w-lg mx-auto aspect-square'>
                    <img 
                        src={lp.data.thumbnail} 
                        alt={`${lp.data.title}의 이미지`}
                        className='rounded-full w-full h-full object-cover border border-black'
                    />
                </div>
                <p className='mt-[30px]'>{lp.data.content}</p>
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
                <div className='flex items-center justify-center gap-1'>
                    <img 
                        src={HeartRed} 
                        alt="하트 아이콘" 
                        className='w-[30px]'
                    />
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
