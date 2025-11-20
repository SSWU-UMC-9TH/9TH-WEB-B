import useCreateComment from "../../hooks/queries/useCreateComment";
import { useState } from "react";

const CommentInput = ({ lpId }: { lpId: number }) => {
  const [value, setValue] = useState("");

  const { mutate: createComment, isPending } = useCreateComment(lpId, () => {
    setValue(""); // 입력창 비우기
  });

  const handleSubmit = () => {
    if (!value.trim()) return;

    createComment({ content: value });
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-1 bg-gray-200 p-2 rounded text-gray-600"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 rounded"
        disabled={isPending}
      >
        작성
      </button>
    </div>
  );
};

export default CommentInput;