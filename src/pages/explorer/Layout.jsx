import { Outlet, NavLink } from "react-router-dom";
import "./explorer.scss";
import Database from "../../utils/Database";
import { useState, useEffect } from "react";
import SearchFilterForm from "./SearchFilterForm";
import SearchBarcodeForm from "./SearchBarcodeForm";

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

    const [barcodeSearch, setBarcodeSearch] = useState(false);

    return (
        <>
            <div className="flex flex-col mt-4 items-center justify-center">
                <div className="flex flex-row rounded-full bg-gray-700 *:p-2 text-white w-fit">
                    <button className={!barcodeSearch && "bg-sky-600 rounded-l-full"} onClick={() => setBarcodeSearch(false)}>Filters</button>
                    <button className={barcodeSearch && "bg-sky-600 rounded-r-full"} onClick={() => setBarcodeSearch(true)}>Barcode/ID</button>
                </div>
                {!barcodeSearch && <SearchFilterForm buildings={buildings} areas={areas} shelves={shelves} />}
                {barcodeSearch && <SearchBarcodeForm />}
            </div>

            <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
        </>
    )
};

export default Layout;