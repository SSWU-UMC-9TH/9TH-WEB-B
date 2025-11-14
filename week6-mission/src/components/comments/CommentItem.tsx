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

const CommentItem = ({ comment }: { comment: CommentType }) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-700">
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
        {comment.author?.name?.[0] ?? "?"}
      </div>

      <div className="flex-1">
        <p className="text-white font-semibold">{comment.author?.name ?? "알 수 없음"}</p>
        <p className="text-gray-300">{comment.content}</p>
        <p className="text-gray-500 text-sm">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;