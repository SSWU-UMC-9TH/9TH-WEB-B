import profile from '../assets/profile.png';
import type { Credit } from '../types/movie';

interface CreditProps {
    credits: Credit[];
}

export const CreditProfile = ({credits}: CreditProps) => {
    return (
        <>
            {credits.map((credit) => (
                <div className="flex flex-col items-center" key={credit.credit_id}> 
                    <img 
                        className="w-[100px] aspect-square object-cover rounded-full border-[2px] border-white text-white"
                        src={credit.profile_path!=null ? `https://image.tmdb.org/t/p/original${credit.profile_path}` : profile}  
                        alt={`${credit.original_name}의 프로필 사진`}
                    />
                    <h4 className="text-white font-bold text-center">{credit.original_name}</h4>
                    <p className="text-gray-500 text-center">{credit.known_for_department}</p>
                </div>
            ))}
        </>
    )
}