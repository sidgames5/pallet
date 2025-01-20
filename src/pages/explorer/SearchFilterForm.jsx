import { useState, useEffect } from "react";

function SearchFilterForm(props) {
    const buildings = props.buildings;
    const areas = props.areas;
    const shelves = props.shelves;


    const [selectedBuilding, setSelectedBuilding] = useState(0);
    const [selectedArea, setSelectedArea] = useState(0);

    useEffect(() => {
        if (buildings.length > 0) {
            setSelectedBuilding(buildings[0].id);
        }
        if (areas.length > 0) {
            for (const a of areas) {
                if (a.building === selectedBuilding) {
                    setSelectedArea(a.id);
                }
            }
        }
    }, [buildings, areas, selectedBuilding]);

    if (buildings.length === 0 || areas.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <form className="search-filters flex flex-row justify-center items-center gap-8 m-4">
            <div className="flex flex-col items-center">
                <label htmlFor="building">Building</label>
                <select name="building" id="building" onChange={(e) => { setSelectedBuilding(parseInt(e.currentTarget.value)) }}>
                    {buildings.map((object) => <option value={object.id}>{object.name}</option>)}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <label htmlFor="area">Room</label>
                <select name="area" id="area" onChange={(e) => { setSelectedArea(parseInt(e.currentTarget.value)) }} >
                    {areas.map((object) => (function () {
                        if (object.building === selectedBuilding) {
                            return <option value={object.id}>{object.name}</option>;
                        }
                        return "";
                    })())}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <label htmlFor="shelf">Shelf</label>
                <select name="shelf" id="shelf">
                    {shelves.map((object) => (function () {
                        console.log(object.area, selectedArea)
                        if (object.area === selectedArea) {
                            console.log(object);
                            return <option value={object.id}>{object.name}</option>;
                        }
                        return "";
                    })())}
                </select>
            </div>
            <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
        </form >
    );
}

export default SearchFilterForm;