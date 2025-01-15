import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "./layout.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
    const links = [
        ["/", "Dashboard"],
        ["/settings", "Settings"]
    ];
    const [inNavMenu, setInNavMenu] = useState(false);
    return (
        <>
            <div className="topnav hidden lg:flex flex-row bg-gray-700">
                {links.map((item) => <NavLink
                    key={item[0]}
                    to={item[0]}
                    className={({ isActive }) => `p-4 text-white transition-all duration-300 ${isActive ? "bg-sky-600" : "hover:bg-gray-200 hover:text-black"}`}
                >{item[1]}</NavLink>)}
            </div>

            <FontAwesomeIcon className="topnav-button fixed lg:hidden size-10 cursor-pointer transition-all duration-300 text-gray-700 hover:text-white hover:bg-gray-700 p-4 rounded-full hover:m-1" icon={faBars} onClick={() => setInNavMenu(true)} />
            <div className={`screen-cover ${inNavMenu ? "flex" : "hidden"} fixed w-screen h-screen bg-black bg-opacity-50`} />
            <div className={`sidenav fixed ${inNavMenu ? "flex" : "hidden"} flex-row`}>
                <div className="flex flex-col w-fit bg-gray-700">
                    {links.map((item) => <NavLink
                        key={item[0]}
                        to={item[0]}
                        className={({ isActive }) => `p-4 text-white transition-all duration-300 ${isActive ? "bg-sky-600" : "hover:bg-gray-200 hover:text-black"}`}
                    >{item[1]}</NavLink>)}
                </div>
                <FontAwesomeIcon className="size-10 cursor-pointer transition-all duration-300 text-white hover:text-white hover:bg-gray-700 p-4 rounded-full hover:m-1" icon={faXmark} onClick={() => setInNavMenu(false)} />
            </div>

            <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
        </>
    )
};

export default Layout;