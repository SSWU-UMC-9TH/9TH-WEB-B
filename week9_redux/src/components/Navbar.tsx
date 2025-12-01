import React, { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { calculateTotals, CartState } from "../slices/CartSlice";

const Navbar = (): React.ReactElement => {
    const { amount, cartItems } = useSelector((state) : CartState => state.cart);
    const dispatch = useDispatch();

    useEffect(():void => {
        dispatch(calculateTotals());
    }, [dispatch, cartItems]);
    
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