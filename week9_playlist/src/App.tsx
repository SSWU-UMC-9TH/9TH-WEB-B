import { Provider, useSelector } from 'react-redux'
import './App.css'
import CartList from './components/CartList'
import Navbar from './components/Navbar'
import store from './store/store'
import PriceBox from './components/PriceBox'
import Modal from './components/Modal'
import type { RootState } from './store/store'

const AppWrapper = () => {
    const { isOpen } = useSelector((state: RootState) => state.modal);

    return (
        <>
            {isOpen && <Modal />}
            <Navbar/>
            <CartList/>
            <PriceBox/>
        </>
    )
}


function App() {
    return (
        <Provider store={store}>
            <AppWrapper />
        </Provider>
    )
}

export default App
