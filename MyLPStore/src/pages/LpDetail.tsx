import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import { useUpdateLp } from "../hooks/mutations/useUpdateLp";
import { useLpLike } from "../hooks/mutations/useLpLike";
import { PAGINATION_ORDER } from "../enums/common";
import { CommentSkeleton } from "../components/Comment/CommentSkeleton";
import usePostComment from "../hooks/mutations/usePostComment";
import useEditComment from "../hooks/mutations/useEditComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import { uploadImage } from "../apis/upload";
import { useAuth } from "../contexts/AuthContext";

export const LpDetail = () => {
  const { lpid } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [commentContent, setCommentContent] = useState("");
  
  // 댓글 편집 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showMenuCommentId, setShowMenuCommentId] = useState<number | null>(null);

  // LP 수정 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    thumbnail: null as File | null,
    tags: "",
    published: false
  });

  // LP 상세 데이터 가져오기
  const { data: lpDetail, isLoading: lpLoading, error: lpError } = useGetLpDetail(lpid);
  
  // LP 기능들
  const deleteLpMutation = useDeleteLp();
  const updateLpMutation = useUpdateLp();
  const likeMutation = useLpLike(lpid!);

  // 댓글 관련 mutation
  const postCommentMutation = usePostComment();
  const editCommentMutation = useEditComment();
  const deleteCommentMutation = useDeleteComment();

  const {
    data: comments,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(lpid, 3, order);

  const { ref, inView } = useInView({ 
    threshold: 0.1,
    rootMargin: '100px'
  });

  useEffect(() => {
    console.log('무한스크롤 디버깅:', { inView, hasNextPage, isFetching });
    if (inView && hasNextPage && !isFetching) {
      console.log('다음 페이지 가져오기!');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenuCommentId(null);
    };

    if (showMenuCommentId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenuCommentId]);

  // LP 수정 모달 열기
  const handleEditLp = () => {
    if (lpDetail) {
      setEditFormData({
        title: lpDetail.title,
        content: lpDetail.content,
        thumbnail: null, // 기존 이미지 URL은 따로 처리
        tags: lpDetail.tags?.map(tag => tag.name).join(', ') || "",
        published: lpDetail.published
      });
      setIsEditModalOpen(true);
    }
  };

  // LP 수정
  const handleEditSubmit = async () => {
    try {
      let thumbnailUrl = lpDetail?.thumbnail || "";
      
      // 새로운 썸네일 이미지가 있으면 업로드
      if (editFormData.thumbnail) {
        const uploadData = await uploadImage(editFormData.thumbnail);
        thumbnailUrl = uploadData.data.imageUrl;
      }

      updateLpMutation.mutate({
        lpId: Number(lpid),
        data: {
          title: editFormData.title,
          content: editFormData.content,
          thumbnail: thumbnailUrl,
          tags: editFormData.tags ? editFormData.tags.split(',').map(tag => tag.trim()) : [],
          published: editFormData.published
        }
      });
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('LP 수정 실패:', error);
      alert('LP 수정에 실패했습니다.');
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 LP를 삭제하시겠습니까?")) {
      deleteLpMutation.mutate(Number(lpid));
    }
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = () => {
    if (!userInfo?.data?.id) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    // 현재 좋아요 상태를 매개변수로 전달
    const isCurrentlyLiked = lpDetail?.likes?.some(like => like.userId === userInfo.data.id);
    likeMutation.mutate(isCurrentlyLiked || false);
  };

  // 현재 사용자가 좋아요를 눌렀는지 확인
  const isLiked = userInfo?.data?.id && lpDetail?.likes?.some(like => like.userId === userInfo.data.id);

  if (lpLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-black text-white">로딩 중...</div>;
  }

  if (lpError) {
    return <div className="flex justify-center items-center min-h-screen bg-black text-red-500">LP를 불러오는데 실패했습니다.</div>;
  }

  if (!lpDetail) {
    return <div className="flex justify-center items-center min-h-screen bg-black text-white">LP를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-black min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* LP 상세 정보 섹션 */}
        <div className="bg-gray-800/50 rounded-lg shadow-lg p-8 mb-8">
          {/* 제목 */}
          <h1 className="flex items-center justify-center text-3xl font-semibold text-white mb-4 flex text-center">{lpDetail.title}</h1>
          
          {/* 업로드 날짜*/}
          <div className="flex items-center justify-center mb-6 text-sm text-gray-300">
            <div className="flex items-center space-x-4">
              <span>{new Date(lpDetail.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* 썸네일 이미지 */}
          {lpDetail.thumbnail && (
            <div className="mb-6">
              <img 
                src={lpDetail.thumbnail} 
                alt={lpDetail.title}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* 본문 내용 */}
          <div className="mb-6">
            <div className="text-gray-200 flex text-center justify-center font-light leading-relaxed whitespace-pre-wrap">
              {lpDetail.content}
            </div>
          </div>

          {/* 태그 */}
          {lpDetail.tags && lpDetail.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-center flex-wrap gap-2">
                {lpDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm border border-pink-600/30"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 좋아요 */}
          <div className="flex justify-between items-center mb-6">
            <div></div> {/* 왼쪽 공간 */}
            <button 
              onClick={handleLikeToggle}
              disabled={likeMutation.isPending}
              className={`flex items-center pl-20 text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isLiked 
                  ? 'text-pink-500 hover:text-pink-600' 
                  : 'text-gray-300 hover:text-pink-400'
              }`}
            >
                <span className="flex items-center cursor-pointer">
                  {isLiked ? '❤️' : '🤍'} {lpDetail.likes?.length || 0}
                </span>
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-300">
                <button 
                  onClick={handleEditLp}
                  className="hover:text-pink-400 transition-colors"
                >
                  수정
                </button>
                <span className="text-gray-500">|</span>
                <button 
                  onClick={handleDelete}
                  disabled={deleteLpMutation.isPending}
                  className="hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  삭제
                </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-gray-800/50 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">댓글</h2>
          
          {/* 댓글 작성란 */}
          <div className="bg-gray-700/50 p-4 rounded-lg shadow-lg mb-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full bg-gray-600/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="댓글을 입력하세요..."
              rows={3}
            ></textarea>
            <button
              onClick={() => {
                if (!commentContent.trim()) return;

                postCommentMutation.mutate(
                {
                  lpId: Number(lpid),
                  content: commentContent,
                  order: order === PAGINATION_ORDER.desc ? "desc" : "asc",
                },
                {
                  onSuccess: () => {
                    console.log("댓글 작성 성공!");
                    setCommentContent("");
                  },
                  onError: (error) => {
                    console.error("댓글 작성 실패:", error);
                    alert("댓글 작성 실패!");
                  },
                }
              );
              }}
              disabled={postCommentMutation.isPending}
              className="mt-2 cursor-pointer bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-2 py-1 text-sm rounded transition-colors"
            >
              보내기
            </button>
          </div>

          {/* 정렬 버튼 */}
          <div className="flex justify-end gap-2 mb-4">
                   <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-3 py-1 rounded-2xl border ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black font-semibold text-sm"
              : "bg-gray-800 text-white text-sm"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-3 py-1 rounded-2xl border ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black font-semibold text-sm"
              : "bg-gray-800 text-white text-sm"
          }`}
        >
          최신순
        </button>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments?.pages
              ?.map((page) => page.data)
              .flat()
              .map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-700/50 p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{comment.author.name}</p>
                      
                      {/* 편집 모드인 경우 */}
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full bg-gray-600/50 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                editCommentMutation.mutate({
                                  commentId: comment.id,
                                  content: editingContent,
                                  lpId: Number(lpid),
                                  order
                                }, {
                                  onSuccess: () => {
                                    setEditingCommentId(null);
                                    setEditingContent("");
                                  }
                                });
                              }}
                              disabled={editCommentMutation.isPending}
                              className="px-3 py-1 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 text-white rounded text-xs"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingContent("");
                              }}
                              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-300 mt-2 font-light text-sm">{comment.content}</p>
                      )}
                      
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    
                    {/* 댓글 메뉴 버튼 (임시로 모든 댓글에 표시) */}
                    {editingCommentId !== comment.id && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenuCommentId(showMenuCommentId === comment.id ? null : comment.id);
                          }}
                          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                        >
                          ⋯
                        </button>
                        
                        {/* 드롭다운 메뉴 */}
                        {showMenuCommentId === comment.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[100px]"
                          >
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingContent(comment.content);
                                setShowMenuCommentId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-t-lg transition-colors"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                  deleteCommentMutation.mutate({
                                    commentId: comment.id,
                                    lpId: Number(lpid),
                                    order
                                  });
                                }
                                setShowMenuCommentId(null);
                              }}
                              disabled={deleteCommentMutation.isPending}
                              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg transition-colors disabled:opacity-50"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {isFetching && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CommentSkeleton key={`comment-skeleton-${index}`} />
                ))}
              </>
            )}
            {comments?.pages && comments.pages.length > 0 && comments.pages.every(page => page.data.length === 0) && (
              <div className="text-gray-400 text-center py-4">댓글이 없습니다.</div>
            )}
          </div>

          {/* 무한 스크롤 트리거 */}
          <div ref={ref} className="h-20 mt-10 rounded flex items-center justify-center text-white text-sm">
            {hasNextPage ? '스크롤하여 더 보기' : '더 이상 댓글이 없습니다'}
          </div>
        </div>
      </div>

      {/* LP 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4 text-center">LP 수정</h2>
            
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1 mt-5">제목</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">내용</label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:outline-none focus:border-pink-500 h-24 resize-none"
                />
              </div>

              {/* 썸네일 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">썸네일</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditFormData({...editFormData, thumbnail: e.target.files?.[0] || null})}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-block px-3 text-sm py-2 bg-pink-600 hover:bg-pink-700 text-white rounded cursor-pointer transition-colors"
                    >
                      파일 선택
                    </label>
                  </div>
                  
                  {/* 미리보기 */}
                  {editFormData.thumbnail && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(editFormData.thumbnail)}
                        alt="썸네일 미리보기"
                        className="max-w-full h-32 object-cover rounded border border-zinc-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 태그 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                  placeholder="태그1, 태그2, 태그3"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-center text-sm font-light gap-2 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-2 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={updateLpMutation.isPending}
                className="px-2 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};