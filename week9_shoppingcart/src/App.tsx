
import './App.css';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
function App() {


  return (
    <>
      <Navbar />
      <PriceBox />
      <CartList />
      <ConfirmModal />
    </>
  )
}

import ConfirmModal from './components/ConfirmModal';
import PriceBox from './components/PriceBox';
export default App;
