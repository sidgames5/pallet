import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <form className="search-filters flex flex-row justify-center items-center gap-8 m-4">
                <div className="flex flex-col items-center">
                    <label htmlFor="building">Building</label>
                    <select name="building" id="building">
                        <option value="4">Warehouse A</option>
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="room">Room</label>
                    <select name="room" id="room">
                        <option value="3">Storage Room</option>
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="shelf">Shelf</label>
                    <select name="shelf" id="shelf">
                        <option value="2">A7</option>
                    </select>
                </div>
                <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
            </form>

            <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
        </>
    )
};

export default Layout;