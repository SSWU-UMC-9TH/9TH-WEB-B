import { useDispatch as UseDefaultDispatch, useSelector as useDefaultSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';

export const useDispatch: () => AppDispatch = UseDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
