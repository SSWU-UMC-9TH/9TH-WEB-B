//zustand 사용
import { create } from "zustand";
import { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/shallow";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;

  action: CartActions;
}

export const useCartStore = create<CartState>()(
  immer((set, _) => ({
    cartItems: cartItems.map(item => ({
      ...item,
      price: Number(item.price),
    })),
    amount: 0,
    total: 0,
    action: {
      increase: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem) {
            cartItem.amount += 1;
          }
        });
        useCartStore.getState().action.calculateTotals();
      },
      decrease: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);
          if (cartItem && cartItem.amount > 0) {
            cartItem.amount -= 1;
          }
        });
        useCartStore.getState().action.calculateTotals();
      },
      removeItem: (id: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter((item) => item.id != id);
        });
        useCartStore.getState().action.calculateTotals();
      },
      clearCart: () => {
        set((state) => {
          state.cartItems = [];
        });
        useCartStore.getState().action.calculateTotals();
      },
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          state.amount = amount;
          state.total = total;
        });
      },
    },
  }))
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    }))
  );

export const useCartActions = () => useCartStore((state) => state.action);