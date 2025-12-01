import type { JSX } from "react";
import type { Lp } from "../types/cart";
import { useAppDispatch } from '../hooks/useCustomRedux';
import { increase, decrease, calculateTotals } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice';

interface CartItemProps {
    lp: Lp;
}   



const CartItem = ({lp}: CartItemProps): JSX.Element => {
    const dispatch = useAppDispatch();

    const handleIncrease = () => {
        dispatch(increase({ id: lp.id }));
        dispatch(calculateTotals());
    };
    const handleDecrease = () => {
        dispatch(decrease({ id: lp.id }));
        dispatch(calculateTotals());
    };
    const handleRemove = () => {
        dispatch(openModal({ id: lp.id }));
    };

    return <div className='flex items-center p-4 border-b border-gray-200'>
        <img src={lp.img}
        alt={`${lp.title}의 LP 이미지`}
        className='w-20 h-20 object-cover rounded mr-4' />
     <div>
        <h3 className = 'text-xl font-semibold'>{lp.title}</h3>
     <p className = 'text-sm text-gray-600'>{lp.singer}</p>
     <p className = 'text-sm font-bold text-gray-600'>가격: {lp.price}원</p>
     </div>
     <div className='flex items-center'>
        <button className= 'px-3 py-[3px] bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer' onClick={handleDecrease}>-</button>
        <span className='px-2'>{lp.amount}</span>
        <button className= 'px-4 py-1 border-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer' onClick={handleIncrease}>+</button>
        <button className='ml-2 px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 cursor-pointer' onClick={handleRemove}>삭제</button>
     </div>
     </div>;
};
export default CartItem;