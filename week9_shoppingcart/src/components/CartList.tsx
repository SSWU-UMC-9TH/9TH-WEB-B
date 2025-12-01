
import CartItem from './CartItem';
import { useAppSelector } from '../hooks/useCustomRedux';

export default function CartList() {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  return (
    <div className='flex flex-col items-center justify-center'>
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
}