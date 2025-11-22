import { getCurrentUserId } from "../../utills/getUserId";
import { useState } from "react";


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
  authorId: number;
}

const CommentItem = ({ comment }: { comment: CommentType }) => {
  const currentUserId = getCurrentUserId();
  const isMine =
  currentUserId === comment.author?.id ||
  currentUserId === comment.authorId;
  const [menuOpen, setMenuOpen] = useState(false);
  const onEdit = () => {
    console.log("edit clicked");
  };

  const onDelete = () => {
    console.log("delete clicked");
  };
  return (
    
    <div className="flex items-start gap-3 py-3 border-b border-gray-700">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-white">
        {comment.author?.avatar ? (
          <img src={comment.author.avatar} className="w-full h-full object-cover" />
        ) : (
          <span>{comment.author?.name?.[0] ?? "?"}</span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-black font-medium">
          {comment.author?.name ?? "알 수 없음"}{" "}
          
        </p>
        <p className="text-gray-500 mt-1">{comment.content}</p>
      </div>
      {isMine && (
  <div className="relative">
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="text-black px-2"
    >
      ⋯
    </button>

    {menuOpen && (
      <div className="absolute right-0 top-6 bg-gray-800 p-2 rounded shadow-lg flex flex-col gap-1 z-50">
        <button
          onClick={onEdit}
          className="text-black hover:text-gray-300 text-sm flex items-center gap-2"
        >
          ✏️ 수정
        </button>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
        >
          🗑 삭제
        </button>
      </div>
    )}
  </div>
)}
    </div>
    
  );
};

export default CommentItem;