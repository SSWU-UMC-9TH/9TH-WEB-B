import { useCounterStore } from '../stores/CounterStore'
import { useShallow } from 'zustand/shallow';
import CounterButton from './CounterButton';

export default function Counter() {
    const {count} = useCounterStore((
        useShallow((state) => ({
            count: state.count,
        }))
    ));

    return (
        <div>
            <h1>{count}</h1>
            <CounterButton />
        </div>
    )
}
