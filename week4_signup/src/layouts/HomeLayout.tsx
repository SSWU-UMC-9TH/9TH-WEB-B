import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
    return (
        <div className="min-h-screen w-full bg-black">
            <Navbar />
            <main className="pt-16 min-h-screen bg-black w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;