import { Outlet, NavLink } from "react-router-dom";
import "./explorer.scss";
import Database from "../../utils/Database";
import { useState, useEffect } from "react";

const Layout = () => {
    const [buildings, setBuildings] = useState([]);
    useEffect(() => {
        async function f() {
            try {
                const data = await Database.read();
                setBuildings(data.buildings || []);
            } catch (error) {
                console.error("Error: ", error);
                setBuildings([]);
            }
        }
        f();
    }, []);

    const [areas, setAreas] = useState([]);
    useEffect(() => {
        async function f() {
            try {
                const data = await Database.read();
                setAreas(data.areas || []);
            } catch (error) {
                console.error("Error: ", error);
                setAreas([]);
            }
        }
        f();
    }, []);

    const [shelves, setShelves] = useState([]);
    useEffect(() => {
        async function f() {
            try {
                const data = await Database.read();
                setShelves(data.shelves || []);
            } catch (error) {
                console.error("Error: ", error);
                setShelves([]);
            }
        }
        f();
    }, []);

    return (
        <>
            <form className="search-filters flex flex-row justify-center items-center gap-8 m-4">
                <div className="flex flex-col items-center">
                    <label htmlFor="building">Building</label>
                    <select name="building" id="building">
                        {buildings.map((object) => <option value={object.id}>{object.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="area">Room</label>
                    <select name="area" id="area">
                        {areas.map((object) => <option value={object.id}>{object.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="shelf">Shelf</label>
                    <select name="shelf" id="shelf">
                        {shelves.map((object) => <option value={object.id}>{object.name}</option>)}
                    </select>
                </div>
                <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
            </form>

            <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
        </>
    )
};

export default Layout;