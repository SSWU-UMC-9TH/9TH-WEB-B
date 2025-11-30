import './App.css';
import CartList from './components/CartList'; // CartList import 경로 수정
import Navbar from './components/Navbar';
import React from 'react';
import store from './store/store';
import { Provider } from 'react-redux';
import PriceBox from './components/PriceBox';
import Modal from './components/Modal';

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <PriceBox />
      <Modal />
    </Provider>
  );
}

export default App;