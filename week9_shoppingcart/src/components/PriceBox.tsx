import { useAppDispatch, useAppSelector } from "../hooks/useCustomRedux";
import { clearCart, calculateTotals } from "../slices/cartSlice";

const PriceBox = () => {
    const { amount, total } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    const handleInitialCart = () => {
        dispatch(clearCart());
        dispatch(calculateTotals());
    }

    return (
        <div className='p-12 flex justify-between items-center'>
            <div>
                <button onClick={handleInitialCart} className="border p-4 rounded-md cursor-pointer">장바구니 초기화</button>
            </div>
            <div className='flex flex-col items-end'>
                <div className='text-lg font-bold'>총 수량: {amount}개</div>
                <div className='text-lg font-bold'>총 가격: {total}원</div>
            </div>
        </div>
    )
}

export default PriceBox