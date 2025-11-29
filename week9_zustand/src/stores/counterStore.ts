import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CounterActions {
    increment: () => void;
    decrement: () => void;
    random: () => void;
}

// 상태에 대한 정의
interface CounterState {
    //value
    count: number;
    randomNumber: number;

    // action
    actions: CounterActions;
}

export const useCounterStore = create<CounterState>()(devtools((set) => ({
    count: 0,
    randomNumber: 0,

    actions: {
        increment: () => 
            // set(partialOrUpdater, shouldReplace = false, actionName)
            set((state) => ({
                count: state.count + 1,
            }),
            false,
            'increment'
        ),
        decrement: () => {
            return set((state) => ({
                count: state.count - 1,
            })),
            false,
            'decrement'
        }, 
        // 0 ~ 99 사이의 랜덤 숫자 생성
        // Math.random() * 100 => 0 ~ 99.99999999
        random: () => {
            set(() => ({
                randomNumber: Math.floor(Math.random() * 100),
            }),
            false,
            'random')
        },
    },
    name: 'counterStore',
})))

// action에 관한 훅을 하나 만들 수 있다.
export const useCounterActions = () => 
    useCounterStore((state) => state.actions);

// Atomic Selector => 모든 갑슨 개별로 꺼내야한다는 규칙

// actions의 객체는 한번 정의했기에 함수의 참조(reference)가 바뀌지 않는다
// 컴포넌트가 항상 동일한 객체를 바라보기 때문에 렌더링에 문제가 없다