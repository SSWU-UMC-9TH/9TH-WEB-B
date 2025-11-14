import { useState } from "react";
import { postComment } from "../../apis/comment";

interface CommentInputProps {
  lpId: number;
  onSuccess: () => void;
}

const CommentInput = ({ lpId, onSuccess }: CommentInputProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    await postComment({ lpId, content });

    setContent("");
    onSuccess();
  };

  return (
    <div className="w-full flex items-center gap-2 py-3">
      <input
        className="flex-1 px-3 py-2 rounded bg-gray-100 text-gray-600"
        placeholder="댓글을 입력해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        작성
      </button>
    </div>
  );
};

export default CommentInput;