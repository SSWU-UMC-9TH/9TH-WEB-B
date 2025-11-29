// src/components/CartPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} from '../store/cartSlice';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cartItems, totalAmount, totalPrice } = useAppSelector(
    state => state.cart
  );

  // 장바구니가 바뀔 때마다 총 수량/금액 계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="w-full min-h-screen bg-white shadow-lg flex flex-col">
      {/* Navbar 영역 */}
      <header className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="font-semibold text-lg">week9-삼이</div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🛒</span>
          <span className="text-sm bg-slate-700 px-3 py-1 rounded-full">
            {totalAmount}
          </span>
        </div>
      </header>

      {/* 리스트 + 푸터를 세로로 나눈다 */}
      <div className="flex flex-col flex-1">
        {/* 리스트 영역 */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cartItems.map(item => (
            <article
              key={item.id}
              className="flex items-center gap-4 border-b pb-3 last:border-b-0"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {item.singer}
                </p>
                <p className="text-sm font-bold mt-1">
                  ₩{item.price.toLocaleString()}
                </p>
              </div>

              {/* 수량 조절 + 삭제 버튼 */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-slate-100 rounded-md px-2 py-1">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-sm"
                    onClick={() => dispatch(decrease(item.id))}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm">
                    {item.amount}
                  </span>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-sm"
                    onClick={() => dispatch(increase(item.id))}
                  >
                    +
                  </button>
                </div>

                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  삭제
                </button>
              </div>
            </article>
          ))}

          {cartItems.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              장바구니가 비어 있어요.
            </p>
          )}
        </main>

        {/* Footer 영역 (총 금액 + 전체 삭제) */}
        <footer className="border-t px-6 py-4 bg-white">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">총 수량</span>
            <span className="font-semibold">{totalAmount}개</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">총 금액</span>
            <span className="font-bold text-lg text-slate-900">
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            className="mt-4 w-full border border-slate-800 text-slate-800 py-2 rounded-md text-sm hover:bg-slate-800 hover:text-black transition"
            onClick={() => dispatch(clearCart())}
          >
            전체 삭제
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CartPage;