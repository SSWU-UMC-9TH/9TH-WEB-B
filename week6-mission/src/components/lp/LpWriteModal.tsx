import { useRef, useState } from "react";
import lpimg from "../../assets/lpimg.png";
import { useCreateLp } from "../../hooks/useCreateLp";
interface LpWriteModalProps {
  open: boolean;
  onClose: () => void;
}

const LpWriteModal = ({ open, onClose }: LpWriteModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { mutate: createLp } = useCreateLp(onClose);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(lpimg);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const handleSubmit = () => {
    createLp({
        title,
        content,
        thumbnail: preview, // 현재 string 형태
        tags,
        published: true,
    });
    };
  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags([...tags, value]);
    setTagInput("");
  };
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* 모달 박스 */}
      <div
        className="bg-[#1E1E1E] text-white w-[380px] rounded-xl p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>

        {/* LP 이미지 */}
        <div className="flex justify-center mb-4">
          <img
            src={preview}
            className="w-24 h-24 cursor-pointer"
            onClick={handleImageClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* LP Name */}
        <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="LP Name"
          className="w-full bg-[#2A2A2A] border border-gray-600 rounded-md px-3 py-2 mb-3 focus:outline-none"
        />

        {/* LP Content */}
        <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="LP Content"
          className="w-full bg-[#2A2A2A] border border-gray-600 rounded-md px-3 py-2 mb-3 focus:outline-none"
        />

        {/* Tag + Add 버튼 */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 bg-[#2A2A2A] border border-gray-600 rounded-md px-3 py-2 focus:outline-none"
          />
          <button
            className="bg-gray-600 px-4 rounded-md hover:bg-gray-500"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 bg-[#2A2A2A] border border-gray-600 rounded-full px-3 py-1"
            >
              <span>{tag}</span>
              <button onClick={() => handleRemoveTag(tag)} className="text-sm">✕</button>
            </div>
          ))}
        </div>

        {/* Add LP 버튼 */}
        <button
            className="w-full bg-blue-600 py-2 rounded-md text-white hover:bg-blue-900 transition"
            onClick={handleSubmit}
            >
            Add LP
            </button>
      </div>
    </div>
  );
};

export default LpWriteModal;