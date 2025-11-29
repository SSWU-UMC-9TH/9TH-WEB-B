import CardItem from './CardItem'
import { useSelector } from '../hooks/useCustomRedux';

const CartList = () => {
    const {cartItems, amount, total} = useSelector((state: CartState) => state.cart);

    return (
        <div className='flex flex-col items-center justify-center'>
            <ul>
                {cartItems.map((item) => (
                    <CardItem key={item.id} lp={item} />
                ))}
            </ul>
        </div>
    )
}

export default CartList
