import { Outlet, Link, NavLink } from "react-router-dom";
import "./layout.scss"

const Layout = () => {
    const links = [
        ["/", "Dashboard"],
        ["/settings", "Settings"]
    ];
    return (
        <>
            <div className="topnav flex flex-row bg-gray-700">
                {links.map((item) => <NavLink
                    key={item[0]}
                    to={item[0]}
                    className={({ isActive }) => `p-4 text-white transition-all duration-300 ${isActive ? "bg-sky-600" : "hover:bg-gray-200 hover:text-black"}`}
                >{item[1]}</NavLink>)}
            </div>

            <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
        </>
    )
};

export default Layout;