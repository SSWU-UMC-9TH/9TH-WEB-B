// src/App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';
import CartPage from './components/CartPage';
CartPage

function App() {
  return (
    <Provider store={store}>
      <div className=" min-h-screen w-screen bg-slate-100">
        <CartPage />
      </div>
    </Provider>
  );
}

export default App;