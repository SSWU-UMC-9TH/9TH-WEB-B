import React, { useRef, useState } from 'react'
import Close from '../assets/close.png';
import DefaultImg from '../assets/lp.png';
import { usePostLp } from '../hooks/mutations/usePostLp';
import type { ChangeEvent } from 'react';

interface ModalProps {
    onClose: () => void;
}

const Modal = ({onClose}: ModalProps) => {
    const [lpName, setLpName] = useState('');
    const [lpContent, setLpContent] = useState('');
    const [lpTag, setLpTag] = useState(''); // 작성 중인 태그
    const [lpTags, setLpTags] = useState<string[]>([]); // 등록된 전체 태그
    const [lpImage, setLpImage] = useState<string|null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {mutate: lpPostMutate, isPending} = usePostLp({
        onSuccessCallback: onClose
    });

    const handleLp = () => {
        if (!lpName || !lpContent || !lpImage) {
            alert("이름, 내용, 썸네일 이미지는 모두 필수입니다.");
            return;
        }
        
        lpPostMutate({
            title: lpName,
            content: lpContent,
            thumbnail: lpImage,
            tags: lpTags,
            published: true
        });
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLpImage(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }


    const addTag = () => {
        if (lpTag) {
            setLpTags(prev => [...prev, lpTag]);
            setLpTag('');
        }
    }

    const deleteTag = (tagToRemove: string) => {
        setLpTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    }

    return (
        <div className='bg-[#434343] w-[300px] z-1000 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-lg p-[20px] flex flex-col gap-[10px]'>
            <button 
                onClick={onClose}
                className='w-[30px]'
            >
                <img 
                    src={Close} 
                    alt="닫기 아이콘" 
                    className='w-[30px] cursor-pointer'
                />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className='hidden'
            />
            <img 
                src={lpImage || DefaultImg} 
                alt="lp 이미지" 
                className='w-[300px] h-[300px] cursor-pointer object-cover'
                onClick={handleImageClick}
            />
            <input 
                type="text" 
                value={lpName}
                onChange={(e) => setLpName(e.target.value)}
                placeholder='LP Name'
                className='border border-white rounded-lg p-[5px] text-white w-full'
            />
            <input 
                type="text" 
                value={lpContent}
                onChange={(e) => setLpContent(e.target.value)}
                placeholder='LP Content'
                className='border border-white rounded-lg p-[5px] text-white w-full'
            />
            <div className='flex gap-2'>
                <input 
                    type="text" 
                    value={lpTag}
                    onChange={(e) => setLpTag(e.target.value)}
                    placeholder='LP Tag'
                    className='border border-white rounded-lg p-[5px] text-white flex-1 w-full'
                />
                <button 
                    className='bg-[#808080] rounded-lg text-white px-[10px] py-[5px] cursor-pointer'
                    onClick={addTag}
                >
                    Add
                </button>
            </div>
            <div className='flex gap-2 flex-wrap'>
                {lpTags.map((tag, index) => (
                    <div 
                        key={index}
                        className='bg-[#282828] text-white rounded-lg flex items-center gap-1 p-2 text-[10px]'
                    >
                        {tag}
                        <button onClick={() => deleteTag(tag)}>
                            <img 
                                src={Close} 
                                alt="닫기 아이콘" 
                                className='w-[10px] cursor-pointer'
                            />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={handleLp}
                className='w-full bg-[#808080] rounded-lg text-white py-[5px] cursor-pointer'
            >
                {isPending ? 'Adding LP...' : 'Add LP'}
            </button>
        </div>
    )
}

export default Modal
