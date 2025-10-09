import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
    return (
        <div className="h-screen flex flex-col bg-black overflow-hidden">
            <Navbar />
            <main className="flex-1 bg-black overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;