import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowLeft, FiHeart, FiCalendar, FiUser, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiSend } from 'react-icons/fi';
import { getLpDetail } from '../apis/routes/lp';
import { likeLp } from '../apis/routes/likeLp';
import { unlikeLp } from '../apis/routes/unlikeLp';
import { createComment, updateComment, deleteComment } from '../apis/routes/comment';
import { updateLp, deleteLp } from '../apis/routes/lp';
import LpCreateModal from '../components/LpCreateModal';
import ErrorMessage from '../components/ErrorMessage';
import type { Comment } from '../types/comment';
import type { LpDetailResponse } from '../types/lp';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import useGetComments from '../hooks/queries/useGetComments';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // LP 수정 useMutation
  const editLpMutation = useMutation<
    any,
    unknown,
    Partial<import('../types/lp').CreateLpRequest>
  >({
    mutationFn: async (data: Partial<import('../types/lp').CreateLpRequest>) => {
      if (!lpId) throw new Error('LP ID 없음');
      return await updateLp(lpId, data);
    },
    onSuccess: () => {
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      alert('LP가 수정되었습니다.');
    },
    onError: (error) => {
      alert('LP 수정에 실패했습니다.');
      console.error('❌ LP 수정 실패:', error);
    },
  });

  // LP 삭제 useMutation
  const deleteLpMutation = useMutation({
    mutationFn: async () => {
      if (!lpId) throw new Error('LP ID 없음');
      return await deleteLp(lpId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      alert('LP가 삭제되었습니다.');
      navigate('/lps');
    },
    onError: (error) => {
      alert('LP 삭제에 실패했습니다.');
      console.error('❌ LP 삭제 실패:', error);
    },
  });
  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
  const [newComment, setNewComment] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const queryClient = useQueryClient();

  // 좋아요 Optimistic Update
  const likeMutation = useMutation({
    mutationFn: async (liked: boolean) => {
      if (!lpId) throw new Error('LP ID 없음');
      if (liked) {
        return await unlikeLp(lpId);
      } else {
        return await likeLp(lpId);
      }
    },
    // Optimistic update
    onMutate: async (liked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpId] });
      const prev = queryClient.getQueryData(['lp', lpId]);
      queryClient.setQueryData(['lp', lpId], (old: any) => {
        if (!old?.data) return old;
        const myUserId = (() => {
          try {
            const userData = localStorage.getItem('userData');
            if (userData) {
              let parsed = JSON.parse(userData);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              if (parsed && parsed.id !== undefined && parsed.id !== null) return String(parsed.id);
            }
          } catch {}
          return '';
        })();
        const liked = old.data.likes.some((l: any) => String(l.userId) === String(myUserId));
        let newLikes;
        if (liked) {
          newLikes = old.data.likes.filter((l: any) => String(l.userId) !== String(myUserId));
        } else {
          newLikes = [...old.data.likes, { id: 'optimistic', userId: myUserId, lpId }];
        }
        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes
          }
        };
      });
      return { prev };
    },
    onError: (err, liked, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['lp', lpId], context.prev);
      }
      alert('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
    }
  });
  // 본인 userId 가져오기 (이중 stringify 대응)
  let myUserId = '';
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      let parsed = JSON.parse(userData);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (parsed && parsed.id !== undefined && parsed.id !== null) {
        myUserId = String(parsed.id);
      }
    }
  } catch {}

  // 댓글 수정/삭제 상태 관리 및 useMutation
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  // 댓글 수정 useMutation
  const updateMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      if (!lpId) throw new Error('LP ID 없음');
      return await updateComment(lpId, commentId, { content });
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditContent('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
    onError: (error: any) => {
      alert('댓글 수정에 실패했습니다.');
      console.error('❌ 댓글 수정 실패:', error);
    },
  });
  // 댓글 삭제 useMutation
  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!lpId) throw new Error('LP ID 없음');
      return await deleteComment(lpId, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
    onError: (error: any) => {
      alert('댓글 삭제에 실패했습니다.');
      console.error('❌ 댓글 삭제 실패:', error);
    },
  });


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
  const {
    data: comments,
    isPending: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
    isError: isCommentsError,
    error: commentsError,
  } = useGetComments({
    lpId: lpId!,
    order: commentOrder,
    limit: 10
  });

  // 댓글 디버깅 로그
  useEffect(() => {
    console.log('🔍 댓글 상태 디버깅:', {
      lpId,
      comments: comments?.length || 0,
      isCommentsLoading,
      isCommentsError,
      commentsError: commentsError?.message,
      commentOrder
    });
  }, [comments, isCommentsLoading, isCommentsError, commentsError, lpId, commentOrder]);

  // 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    console.log('🔍 LpDetailPage 토큰 체크:', { 
      accessToken, 
      storedToken: token,
      showModal: !accessToken && !token 
    });
    
    // AuthContext와 localStorage 둘 다 토큰이 없을 때만 모달 표시
    if (!accessToken && !token) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [accessToken]);

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

  // 댓글 작성 useMutation (성공 시 invalidate)
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!lpId) throw new Error('LP ID 없음');
      return await createComment(lpId, { content });
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId, commentOrder] });
    },
    onError: (error: any) => {
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
      console.error('❌ 댓글 생성 실패:', error);
    },
  });

  // 댓글 작성 핸들러
  const handleSubmitComment = () => {
    if (!newComment.trim() || !lpId) return;
    const userData = localStorage.getItem('userData');
    if (!userData) {
      alert('로그인이 필요합니다.');
      return;
    }
    commentMutation.mutate(newComment.trim());
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
            {/* 좋아요 버튼 (Optimistic Update) */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
                lp.likes.some((l: any) => String(l.userId) === String(myUserId))
                  ? 'bg-pink-700 hover:bg-pink-800'
                  : 'bg-pink-600 hover:bg-pink-700'
              }`}
              onClick={() => likeMutation.mutate(lp.likes.some((l: any) => String(l.userId) === String(myUserId)))}
              disabled={likeMutation.isPending}
            >
              <FiHeart size={16} />
              {lp.likes.some((l: any) => String(l.userId) === String(myUserId)) ? '좋아요 취소' : '좋아요'}
            </button>
            {/* 본인만 수정/삭제 가능 */}
            {String(lp.authorId) === String(myUserId) && (
              <>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  onClick={() => setShowEditModal(true)}
                >
                  <FiEdit size={16} />
                  수정
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                  onClick={() => {
                    if (window.confirm('정말 삭제하시겠습니까?')) deleteLpMutation.mutate();
                  }}
                  disabled={deleteLpMutation.isPending}
                >
                  <FiTrash2 size={16} />
                  삭제
                </button>
              </>
            )}
          </div>
      {/* LP 수정 모달 */}
      {showEditModal && (
        <LpCreateModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initial={{
            title: lp.title,
            description: lp.content,
            tags: lp.tags.map((t: any) => t.name),
            imageUrl: lp.thumbnail
          }}
          onSubmit={(formData) => {
            // formData에서 값 추출 후 editLpMutation.mutate 호출
            const data: any = {};
            formData.forEach((value, key) => {
              if (key === 'tags') {
                if (!data.tags) data.tags = [];
                data.tags.push(value);
              } else if (key === 'description') {
                data.content = value;
              } else if (key === 'imageUrl') {
                data.thumbnail = value;
              } else if (key === 'image') {
                // 파일 업로드는 별도 처리 필요(여기선 URL만 전달)
              } else {
                data[key] = value;
              }
            });
            editLpMutation.mutate(data);
          }}
        />
      )}

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
          {isCommentsLoading ? (
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
              {comments.map((comment: Comment) => {
                // 디버깅: 본인 댓글 판별 값 콘솔 출력
                console.log('[댓글 디버깅]', {
                  myUserId,
                  'comment.authorId': comment.authorId,
                  'comment.author?.id': comment.author?.id,
                  'myUserId type': typeof myUserId,
                  'authorId type': typeof comment.authorId,
                  'author?.id type': typeof comment.author?.id
                });
                const isMine = myUserId && (
                  String(comment.authorId) === String(myUserId) ||
                  String(comment.author?.id) === String(myUserId)
                );
                return (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                        <FiUser size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">{comment.author.nickname}</span>
                          <span className="text-gray-400 text-sm">{getRelativeTime(comment.createdAt)}</span>
                          {/* 본인 댓글만 ... 메뉴 노출 */}
                          {isMine && (
                            <div className="relative inline-block text-left ml-2">
                              <button
                                className="p-1 rounded hover:bg-gray-700"
                                onClick={() => setEditingCommentId(editingCommentId === comment.id ? null : comment.id)}
                                title="댓글 메뉴"
                              >
                                <span style={{ fontSize: 20, fontWeight: 'bold' }}>…</span>
                              </button>
                              {/* 메뉴: 수정/삭제 */}
                              {editingCommentId === comment.id && (
                                <div className="absolute z-10 right-0 mt-2 w-24 bg-white rounded shadow-lg py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setEditContent(comment.content);
                                      setEditingCommentId('edit-' + comment.id);
                                    }}
                                  >수정</button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    onClick={() => deleteMutation.mutate(comment.id)}
                                  >삭제</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {/* 수정 모드 */}
                        {editingCommentId === 'edit-' + comment.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                              value={editContent}
                              onChange={e => setEditContent(e.target.value)}
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded"
                                onClick={() => updateMutation.mutate({ commentId: comment.id, content: editContent })}
                                disabled={!editContent.trim()}
                              >저장</button>
                              <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                onClick={() => setEditingCommentId(null)}
                              >취소</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
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
          {!isCommentsLoading && hasNextPage && !isFetchingNextPage && (
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
          {!isCommentsLoading && comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">첫 번째 댓글을 작성해보세요!</p>
              {isCommentsError && (
                <p className="text-red-400 text-sm mt-2">
                  댓글을 불러오는 중 오류가 발생했습니다: {commentsError?.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LpDetailPage;
