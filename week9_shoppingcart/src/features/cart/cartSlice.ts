import { createSlice } from "@reduxjs/toolkit";
import { cartItems } from "../../constant/cartitems";
import type { CartItems } from "../../types/cart";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CartState = {
    cartItems: cartItems,
    amount: 0,
    total: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increase: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id===itemId);
            if (item) {
                item.amount += 1;
            }
        },
        decrease: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id===itemId);
            if (item) {
                item.amount -= 1;
                if (item.amount < 1) {
                    state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== itemId);
                }
            }
        },
        removeItem: (state, action: PayloadAction<{id: string}>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter(
                (cartItem) => cartItem.id !== itemId
            )
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.amount = 0;
            state.total = 0;
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * Number(item.price);
            });
            state.amount = amount;
            state.total = total;
        }
    },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
