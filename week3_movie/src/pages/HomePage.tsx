import { Outlet } from "react-router-dom"
import {Navbar} from "../components/Navbar" // Adjust the path if your Navbar is located elsewhere

const HomePage = () => {
  return (
    <div>
        <div> <Navbar /> </div>
        <Outlet />
    </div>
  );
}

export default HomePage
