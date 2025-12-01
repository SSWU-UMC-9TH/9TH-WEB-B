import { FaShoppingCart } from "react-icons/fa";
import { useCartInfo } from "../hooks/useCartStore";

const Navbar = (): React.ReactElement => {
    const { amount } = useCartInfo(); // zustand
    
  return (
    <div className="flex justify-between item-center p-4 bg-gray-300 text-white">
      <h1 onClick={() : void =>{
        window.location.href = '/';
      }} className="text-2xl text-black font-base cursor-pointer">MyPlayList</h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );

};

export default Navbar;