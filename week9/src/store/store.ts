// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// 타입 유틸
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;