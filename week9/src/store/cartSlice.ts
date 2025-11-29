import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { cartItems as initialItems } from '../constants/cartItems';
import type { CartItem } from '../constants/cartItems';
interface CartState {
  cartItems: CartItem[];
  totalAmount: number;
  totalPrice: number;
}

const initialState: CartState = {
  cartItems: initialItems,
  totalAmount: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item) item.amount += 1;
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item && item.amount > 1) {
        item.amount -= 1;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
    },
    clearCart: state => {
      state.cartItems = [];
    },
    calculateTotals: state => {
      let amount = 0;
      let price = 0;

      state.cartItems.forEach(item => {
        amount += item.amount;
        price += item.amount * item.price;
      });

      state.totalAmount = amount;
      state.totalPrice = price;
    },
  },
});

export const {
  increase,
  decrease,
  removeItem,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;