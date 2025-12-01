import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import modalReducer from "../features/modal/modalSlice";

// 1. 저장소 생성
function createStore() {
    const store = configureStore({
        reducer: {
            cart: cartReducer,
            modal: modalReducer,
        },
    });
    return store;
}


const store = createStore();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;