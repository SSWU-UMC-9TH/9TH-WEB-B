import { useCounterActions } from '../stores/CounterStore'

export default function CounterButton() {
    const {increment, decrement} = useCounterActions()

    return (
        <>
            <button onClick={increment}>증가</button>
            <button onClick={decrement}>감소</button>
        </>
    )
}
