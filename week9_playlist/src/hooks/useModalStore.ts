import { create } from "zustand";

interface ModalActions {
    openModal: () => void;
    closeModal: () => void;
}

interface ModalState {
    isOpen: boolean;
}

interface ModalStore extends ModalState {
    actions: ModalActions;
}

export const useModalStore = create<ModalStore>((set) => ({
    isOpen: false,
    actions: {
        openModal: () => set({ isOpen: true }),
        closeModal: () => set({ isOpen: false }),
    }
}));

export const useIsModalOpen = () => useModalStore((state) => state.isOpen);

export const useModalActions = () => useModalStore((state) => state.actions);