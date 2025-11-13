import React, { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { getMyInfo } from '../apis/auth'
import type { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import DefaultUser from '../assets/default-user.png';
import { useUpdateMyInfo } from '../hooks/mutations/useUpdateMyInfo';

const MyPage = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto|null>(null);
    console.log('data', data);
    const [name, setName] = useState<string>();
    const [bio, setBio] = useState<string>();
    const [avatar, setAvatar] = useState<string|null>(null);
    const [email, setEmail] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {mutate: profileUpdateMute} = useUpdateMyInfo();

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            setData(response);
        }
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }
    
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    const handleUpdateProfile = async () => {
        if (!name) {
            alert('이름을 필수로 작성해주세요.');
            return;
        }
        profileUpdateMute({
            name,
            bio,
            avatar
        });
    }

    useEffect(() => {
        if (data?.data) {
            setName(data.data.name);
            setBio(data.data.bio || '');
            setAvatar(data.data.avatar || '');
            setEmail(data.data.email);
        }
    }, [data?.data])

    if (!data) {
        return;
    }

    return (
        <div className='flex mt-[20px]'>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className='hidden'
            />
            <img 
                src={avatar || data.data?.avatar || DefaultUser} 
                alt="프로필 이미지"
                className='rounded-full w-[200px] h-[200px] object-cover mx-[20px] cursor-pointer'
                onClick={handleImageClick}
            />
            <div className='flex flex-col gap-[20px]'>
                <div className='flex item-center gap-2'>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border border-white text-white rounded-lg p-2'
                    />
                    <button 
                        onClick={handleUpdateProfile}
                        className='cursor-pointer'
                    >
                        <Check />
                    </button>
                </div>
                <input 
                    type="text" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className='border border-white text-white rounded-lg p-2'
                />
                <p>{email}</p>
                <button 
                    className='cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90'
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
        </div>
    )
}

export default MyPage
