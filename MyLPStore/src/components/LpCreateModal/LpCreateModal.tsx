import { useState } from "react";
import { useCreateLP } from "../../hooks/mutations/useCreateLP";
import { uploadImage } from "../../apis/upload";

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [lpTag, setLpTag] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const createLpMutation = useCreateLP();


  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }

  if (!isOpen) return null;

  const handleAddLP = async () => {
    // 유효성 검사
    if (!lpName.trim() || !lpContent.trim()) {
      alert('LP 이름과 내용을 입력해주세요.');
      return;
    }
    
    try {
      setIsUploading(true);
      
      let thumbnailUrl = "https://example.com/default-thumbnail.png"; // 기본 이미지
      
      // 파일이 선택된 경우 먼저 업로드
      if (selectedFile) {
        console.log("이미지 업로드 중...");
        const uploadResponse = await uploadImage(selectedFile);
        if (uploadResponse.status && uploadResponse.data?.imageUrl) {
          thumbnailUrl = uploadResponse.data.imageUrl;
          console.log("업로드된 이미지 URL:", thumbnailUrl);
        } else {
          alert('이미지 업로드에 실패했습니다.');
          return;
        }
      }

      // LP 생성 요청
      createLpMutation.mutate(
        {
          title: lpName,
          content: lpContent,
          thumbnail: thumbnailUrl,
          tags: tags,
          published: true
        },
        {
          onSuccess: () => {
            // 성공 시 모달 닫기
            onClose();
            // 폼 초기화
            setLpName("");
            setLpContent("");
            setLpTag("");
            setTags([]);
            setSelectedFile(null);
          },
          onError: (error) => {
            console.error('LP 생성 실패:', error);
            alert('LP 생성에 실패했습니다.');
          },
        }
      );
      
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = () => {
    if (!lpTag.trim()) return;
    setTags(prev => [...prev, lpTag.trim()]);
    setLpTag("");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-80 max-w-sm mx-4 relative">
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
          aria-label="모달 닫기"
        >
          ×
        </button>

        {/* LP 레코드 이미지 */}
        <div className="flex justify-center mb-6 mt-2">
          <div 
            onClick={handleImageClick}
            className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-gray-600 transition-colors"
          >
            {selectedFile ? (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Selected LP" 
                className="w-full h-full"
              />
            ) : (
              <div className="text-gray-400 text-2xl">+</div>
            )}
          </div>
          <input 
            id="file-input"
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* 입력 필드들 */}
        <div className="space-y-4">
          <div>
            <input 
              type="text"
              placeholder="LP Name"
              value={lpName}
              onChange={(e) => setLpName(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded border-none outline-none focus:bg-gray-600"
            />
          </div>

          <div>
            <input 
              type="text"
              placeholder="LP Content"
              value={lpContent}
              onChange={(e) => setLpContent(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded border-none outline-none focus:bg-gray-600"
            />
          </div>

          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="LP Tag"
              value={lpTag}
              onChange={(e) => setLpTag(e.target.value)}
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded border-none outline-none focus:bg-gray-600"
            />
            <button onClick={handleAddTag} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-200">
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
                <div className="flex bg-gray-600 rounded-full px-3 py-1">
                    <div
                    key={idx}
                    className="text-white text-sm">
                    #{tag}
                </div>
                <button onClick={() => handleRemoveTag(tag)} className="text-sm ml-2 text-gray-300">×</button></div>
            ))}
            </div>

          {/* Add LP 버튼 */}
          <button 
            onClick={handleAddLP}
            disabled={createLpMutation.isPending || isUploading}
            className="w-full bg-pink-300 hover:bg-pink-400 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 px-4 rounded transition duration-200 font-medium mt-6"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
};
