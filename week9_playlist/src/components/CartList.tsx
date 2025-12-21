import CardItem from './CardItem'
import { useCartInfo } from '../hooks/useCartStore';

const CartList = () => {
    const {cartItems} = useCartInfo();

    return (
        <>
            <div className='flex flex-col items-center justify-center'>
                <ul>
                    {cartItems.map((item) => (
                        <CardItem key={item.id} lp={item} />
                    ))}
                </ul>
            </div>
        </>
    )
}

export default CartList
