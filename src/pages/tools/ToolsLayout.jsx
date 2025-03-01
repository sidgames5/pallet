import { NavLink, Outlet } from "react-router-dom";

export default function ToolsLayout() {
    const links = [
        ["/tools", "Tools Home"],
        ["/tools/barcode", "Barcode Generator"]
    ];
    return (<div className="flex flex-col items-center align-middle justify-center w-full h-full">
        <div className="topnav flex flex-row my-8 bg-gray-700 rounded-lg overflow-hidden">
            {links.map((item) => <NavLink
                key={item[0]}
                to={item[0]}
                className={({ isActive }) => `p-2 text-white transition-all duration-300 ${isActive ? "bg-sky-600" : "hover:bg-gray-200 hover:text-black"}`}
            >{item[1]}</NavLink>)}
        </div>
        <Outlet />
    </div>)
}