import './App.css'
import Counter from './components/Counter'
import RandomNumberGenerator from './components/RandomNumberGenerator'

function App() {
    return (
        <div className='flex flex-col gap-[100px]'>
            <Counter />
            <RandomNumberGenerator />
        </div>
    )
}

export default App
