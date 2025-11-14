import { useRef, useEffect } from "react";
import CommentItem from "./CommentItem";

interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface CommentType {
  id: number;
  content: string;
  createdAt: string;
  author: CommentAuthor | null;
}

interface CommentListProps {
  comments: CommentType[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const CommentList = ({
  comments,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: CommentListProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      <div ref={observerRef} className="w-full h-10" />

      {isFetchingNextPage && (
        <p className="text-gray-400 py-2">로딩중...</p>
      )}
    </div>
  );
};

export default CommentList;