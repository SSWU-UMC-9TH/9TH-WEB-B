import './App.css'
import CartList from './components/CartList'
import Navbar from './components/Navbar'
import PriceBox from './components/PriceBox'
import Modal from './components/Modal'
import { useIsModalOpen } from './hooks/useModalStore'

function App() {
    const isOpen = useIsModalOpen();

    return (
        <>
            {isOpen && <Modal />}
            <Navbar/>
            <CartList/>
            <PriceBox/>
        </>
    )
}

export default App
