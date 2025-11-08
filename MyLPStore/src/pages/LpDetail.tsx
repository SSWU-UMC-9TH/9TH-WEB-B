import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import { useDeleteLp } from "../hooks/queries/useDeleteLp";
import { PAGINATION_ORDER } from "../enums/common";
import { CommentSkeleton } from "../components/Comment/CommentSkeleton";

export const LpDetail = () => {
  const { lpid } = useParams();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  // LP 상세 데이터 가져오기
  const { data: lpDetail, isLoading: lpLoading, error: lpError } = useGetLpDetail(lpid);
  
  // LP 삭제 기능
  const deleteLpMutation = useDeleteLp();

  // 디버깅용 useEffect
  useEffect(() => {
    console.log('LP Detail 상태:', { lpDetail, lpLoading, lpError, lpid });
  }, [lpDetail, lpLoading, lpError, lpid]);

  const {
    data: comments,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(lpid, 10, order);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    if (window.confirm("정말로 이 LP를 삭제하시겠습니까?")) {
      deleteLpMutation.mutate(Number(lpid));
    }
  };

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
            <div className="text-gray-200 flex text-center font-light leading-relaxed whitespace-pre-wrap">
              {lpDetail.content}
            </div>
          </div>

          {/* 좋아요 */}
          <div className="flex justify-between items-center mb-6">
            <div></div> {/* 왼쪽 공간 */}
            <button className="flex items-center pl-20 text-xl text-gray-300 hover:text-pink-400 transition-colors">
                <span className="flex items-center">
                  ❤️ {lpDetail.likes?.length || 0}
                </span>
            </button>
            <div className="flex items-center gap-3 text-sm text-gray-300">
                <button className="hover:text-pink-400 transition-colors">
                  수정
                </button>
                <span className="text-gray-500">|</span>
                <button 
                  onClick={handleDelete}
                  disabled={deleteLpMutation.isPending}
                  className="hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLpMutation.isPending ? "삭제 중..." : "삭제"}
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
              className="w-full bg-gray-600/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="댓글을 입력하세요..."
              rows={3}
            ></textarea>
            <button className="mt-2 cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 text-sm rounded transition-colors">
              댓글 작성
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
                  <p className="text-white font-semibold text-sm">{comment.author.name}</p>
                  <p className="text-gray-300 mt-2 font-light text-sm">{comment.content}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </p>
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
          <div ref={ref} className="h-10"></div>
        </div>
      </div>
    </div>
  );
};