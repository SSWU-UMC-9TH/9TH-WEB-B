import React, { useState } from 'react';
import Modal from './Modal';

interface Tag {
  id: number;
  text: string;
}

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
  initial?: {
    title?: string;
    description?: string;
    tags?: string[];
    imageUrl?: string;
  };
}

const LpCreateModal: React.FC<LpCreateModalProps> = ({ isOpen, onClose, onSubmit, initial }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [tags, setTags] = useState<Tag[]>(initial?.tags ? initial.tags.map((t, i) => ({ id: i, text: t })) : []);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || '');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.some(t => t.text === tagInput.trim())) {
      setTags([...tags, { id: Date.now(), text: tagInput.trim() }]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (id: number) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    tags.forEach(tag => formData.append('tags', tag.text));
    if (file) {
      formData.append('image', file);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full min-w-[320px]">
        <h2 className="text-xl font-bold mb-2">LP 작성</h2>
        <input
          className="border rounded px-3 py-2"
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="설명"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span key={tag.id} className="bg-pink-200 text-pink-800 rounded px-2 py-1 flex items-center gap-1">
              {tag.text}
              <button type="button" onClick={() => handleRemoveTag(tag.id)} className="ml-1 text-xs">×</button>
            </span>
          ))}
          <input
            className="border rounded px-2 py-1 w-24"
            placeholder="태그 추가"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : undefined)}
          />
          <button type="button" onClick={handleAddTag} className="bg-pink-500 text-white rounded px-2 py-1 text-xs">추가</button>
        </div>
        {imageUrl && (
          <div className="mb-2">
            <img src={imageUrl} alt="썸네일 미리보기" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginBottom: 8, background: '#222' }} />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="bg-pink-500 text-white rounded px-4 py-2 mt-2">등록</button>
      </form>
    </Modal>
  );
};

export default LpCreateModal;
