import { createSlice } from '@reduxjs/toolkit';

export interface ModalState {
  isOpen: boolean;
  deleteId?: string;
}

const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.deleteId = action.payload?.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.deleteId = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
