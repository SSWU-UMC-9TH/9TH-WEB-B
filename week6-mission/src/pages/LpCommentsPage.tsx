import { useParams, useNavigate } from "react-router-dom";
import useGetComments from "../hooks/queries/useGetComments";
import CommentList from "../components/comments/CommentList";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import CommentInput from "../components/comments/CommentInput";
import LpCommentSkeletonList from "../components/LpCommentSkeletonList";
LpCommentSkeletonList

const LpCommentsPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetComments({
    lpId: Number(lpid),
    order,
  });

  const comments = data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  /* 🔥 첫 로딩에서 Skeleton */
  if (isPending)
    return (
      <div className="mt-20 max-w-3xl mx-auto text-white px-4">
        <LpCommentSkeletonList count={5} />
      </div>
    );

  if (isError)
    return (
      <div className="text-center mt-20 text-white">
        댓글을 불러오는 중 오류가 발생했습니다.
      </div>
    );

  return (
    <div className="mt-20 max-w-3xl mx-auto text-white px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="hover:text-gray-300">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-2xl font-bold">댓글</h1>
      </div>

      {/* 댓글 입력 */}
      <CommentInput
    lpId={Number(lpid)}
  />

      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4">
        <div className="flex">
          <button
            onClick={() => setOrder("asc")}
            className={`px-4 py-2 rounded-l-lg border border-gray-500 
              ${order === "asc" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder("desc")}
            className={`px-4 py-2 rounded-r-lg border border-gray-500 
              ${order === "desc" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {comments.length > 0 ? (
        <>
          <CommentList
            comments={comments}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
          />

          {/* 무한스크롤 추가 로딩 Skeleton */}
          {isFetchingNextPage && <LpCommentSkeletonList count={3} />}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          아직 작성된 댓글이 없습니다.
        </div>
      )}
    </div>
  );
};

export default LpCommentsPage;