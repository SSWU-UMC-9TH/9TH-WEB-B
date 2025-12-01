import { create } from 'zustand';
import { cartItems } from '../constant/cartitems';
import type { CartItems, Lp } from '../types/cart';

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,
  increase: (id) => set((state) => {
    const item = state.cartItems.find((cartItem) => cartItem.id === id);
    if (item) item.amount += 1;
    get().calculateTotals();
    return { cartItems: [...state.cartItems] };
  }),
  decrease: (id) => set((state) => {
    const item = state.cartItems.find((cartItem) => cartItem.id === id);
    if (item) {
      item.amount -= 1;
      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
      }
    }
    get().calculateTotals();
    return { cartItems: [...state.cartItems] };
  }),
  removeItem: (id) => set((state) => {
    state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
    get().calculateTotals();
    return { cartItems: [...state.cartItems] };
  }),
  clearCart: () => set((state) => {
    get().calculateTotals();
    return { cartItems: [], amount: 0, total: 0 };
  }),
  calculateTotals: () => set((state) => {
    let amount = 0;
    let total = 0;
    state.cartItems.forEach((item) => {
      amount += item.amount;
      total += item.amount * Number(item.price);
    });
    return { amount, total };
  }),
}));

interface ModalState {
  isOpen: boolean;
  deleteId?: string;
  openModal: (id?: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  deleteId: undefined,
  openModal: (id) => set(() => ({ isOpen: true, deleteId: id })),
  closeModal: () => set(() => ({ isOpen: false, deleteId: undefined })),
}));
