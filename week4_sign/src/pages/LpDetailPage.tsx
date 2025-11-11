import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiHeart, FiCalendar, FiUser, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiSend } from 'react-icons/fi';
import { getLpDetail } from '../apis/routes/lp';
import { getMockComments, createMockComment } from '../data/mockData';
import ErrorMessage from '../components/ErrorMessage';
import type { Comment } from '../types/comment';
import type { LpDetailResponse } from '../types/lp';
import { useState, useEffect, useCallback } from 'react';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
  const [newComment, setNewComment] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [forceCommentLoading, setForceCommentLoading] = useState(false);

  const {
    data: lpData,
    isLoading,
    isError,
    refetch,
  } = useQuery<LpDetailResponse>({
    queryKey: ['lp', lpId],
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
  });

  // 댓글 목록 useInfiniteQuery
  const {
    data: commentsData,
    isPending: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, commentOrder],
    queryFn: ({ pageParam = 0 }) => 
      getMockComments(lpId!),
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!lpId,
  });

  // 모든 페이지의 댓글을 플랫화
  const comments = commentsData?.pages?.flatMap(page => page?.data?.data || []) || [];

  // 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
    }
  }, []);

  // 상대적 시간 계산 함수
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return '방금 전';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      return commentDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // 댓글 작성 함수
  const handleSubmitComment = () => {
    if (!newComment.trim() || !lpId) return;
    
    // 현재 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem('userData');
    if (!userData) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const user = JSON.parse(userData);
    
    // 댓글 추가
    createMockComment(newComment.trim(), lpId!);
    
    // 입력창 초기화
    setNewComment('');
    
    // 댓글 목록 새로고침
    refetchComments();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-700 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lpData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message="LP 정보를 불러오는데 실패했습니다."
          onRetry={refetch}
        />
      </div>
    );
  }

  const lp = lpData.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">
              LP 상세 페이지를 보려면 로그인해주세요.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                로그인하기
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                메인으로
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">LP 상세</h1>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Thumbnail */}
        <div className="order-2 lg:order-1">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
            {!imageError ? (
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiUser size={64} className="text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white leading-tight">
            {lp.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <FiUser size={16} />
              <span>{lp.author.nickname}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FiCalendar size={16} />
              <span>{formatDate(lp.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FiHeart size={16} />
              <span>{lp.likes.length} 좋아요</span>
            </div>
          </div>

          {/* Tags */}
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-pink-600 text-white text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {lp.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-white">
              <FiHeart size={16} />
              좋아요
            </button>
            
            {/* 작성자만 보이는 버튼들 (실제로는 권한 체크 필요) */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white">
              <FiEdit size={16} />
              수정
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white">
              <FiTrash2 size={16} />
              삭제
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">상태:</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              lp.published 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}>
              {lp.published ? '공개' : '비공개'}
            </span>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">댓글</h2>
            
            {/* 댓글 정렬 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">정렬:</span>
              <select 
                value={commentOrder} 
                onChange={(e) => setCommentOrder(e.target.value as 'asc' | 'desc')}
                className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                <option value="desc">최신순</option>
                <option value="asc">오래된순</option>
              </select>
            </div>
          </div>

          {/* 댓글 섹션 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">댓글</h3>
            <button
              onClick={() => setForceCommentLoading(!forceCommentLoading)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm transition-colors"
            >
              {forceCommentLoading ? '댓글 스켈레톤 OFF' : '댓글 스켈레톤 ON'}
            </button>
          </div>

          {/* 댓글 작성란 */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                <FiUser size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${newComment.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                    {newComment.length}/500
                  </span>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || newComment.length > 500}
                    className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <FiSend size={16} />
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          {(isCommentsLoading || forceCommentLoading) ? (
            /* 초기 댓글 로딩 스켈레톤 - 상단 */
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`comment-skeleton-${i}`} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* 실제 댓글들 */}
              {comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <FiUser size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{comment.author.nickname}</span>
                        <span className="text-gray-400 text-sm">
                          {getRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 추가 댓글 로딩 스켈레톤 - 하단 */}
              {isFetchingNextPage && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`loading-comment-${i}`} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-full mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 더보기 버튼 */}
          {!isCommentsLoading && !forceCommentLoading && hasNextPage && !isFetchingNextPage && (
            <div className="text-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                댓글 더보기
              </button>
            </div>
          )}

          {/* 댓글이 없을 때 */}
          {!isCommentsLoading && !forceCommentLoading && comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;

