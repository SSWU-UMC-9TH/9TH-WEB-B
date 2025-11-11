import type { Lp } from "../../types/lps";
import { useNavigate } from "react-router-dom";
import Heart from '../../assets/heart.png';

interface LpCardProps {
    lp: Lp;
}

const LpCard = ({lp}: LpCardProps) => {
    console.log('lp 정보', lp);

    const navigate = useNavigate();

    const formatRelativeTime = (dateString: string): string => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}초 전`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}분 전`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)}일 전`;
        }
    }

    return (
        <button 
            className='relative overflow-hidden shadow-lg transition-shadow duration-300
                hover:shadow-2xl hover:scale-110 cursor-pointer z-10 group-hover:z-30'
                onClick={() => navigate(`lps/${lp.id}`)}
        >
            <img 
                src={lp.thumbnail}
                alt={lp.title}
                className='object-cover w-48 h-48'
            />
            <div className="absolute inset-0 bottom-[10px] p-[10px] w-full h-48 bg-[#000000db] bg-opacity-70 opacity-0 hover:opacity-70 flex flex-col justify-end transition-opacity duration-300">
                <h3 className="text-white text-sm font-semibold m-[5px] text-left">{lp.title}</h3>
                <div className="flex justify-between m-[5px]">
                    <h4>{formatRelativeTime(lp.createdAt)}</h4>
                    <div className="flex items-center gap-1">
                        <img 
                            src={Heart} 
                            alt="하트 아이콘" 
                            className="w-[15px] h-[15px]"
                        />
                        <h4>{lp.likes.length}</h4>
                    </div>
                </div>
            </div>
        </button>
    )
}

export default LpCard;