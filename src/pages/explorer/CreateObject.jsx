import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Database from "../../utils/Database";

function CreateObject(props) {
    const [objectType, setObjectType] = useState("item");
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [effectSelectionDone, setEffectSelectionDone] = useState(false);
    const [db, setDb] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(0);
    const [selectedArea, setSelectedArea] = useState(0);
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await Database.read();
                if (isMounted) {
                    setDb(data);
                }
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                if (isMounted) {
                    setEffectDbDone(true);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (db == null) {
            return;
        }
        if (db.buildings.length > 0) {
            setSelectedBuilding(db.buildings[0].id);
        }
        if (db.areas.length > 0) {
            for (const a of db.areas) {
                if (a.building === selectedBuilding) {
                    setSelectedArea(a.id);
                }
            }
        }
        setEffectSelectionDone(true);
    }, [db, selectedBuilding]);

    if (!effectDbDone || !effectSelectionDone) {
        return <h1>Loading</h1>;
    }

    return (
        <div className="bg-gray-300 p-8 rounded-lg fixed flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-row items-center align-middle justify-center">
                <FontAwesomeIcon className="mr-4 p-2 size-4 bg-gray-700 rounded-full text-white hover:bg-sky-600 transition-all duration-300 cursor-pointer" icon={faClose} onClick={props.onClose} />
                <h6>Create new entry</h6>
            </div>
            <form className="flex flex-col items-center justify-center gap-1 mt-1" onSubmit={(e) => {
                e.preventDefault();
                props.onSubmit(e);
            }}>
                <div className="flex flex-row align-middle">
                    <label htmlFor="type">Type: </label>
                    <select name="type" id="type" onChange={(e) => setObjectType(e.target.value)} required>
                        <option value="item">Item</option>
                        <option value="shelf">Shelf</option>
                        <option value="area">Area</option>
                        <option value="building">Building</option>
                    </select>
                </div>
                <div className="flex flex-row align-middle">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" id="name" required />
                </div>
                {objectType !== "building" && <div className="flex flex-row align-middle">
                    <label htmlFor="building">Building: </label>
                    {/* <input type="number" name="building" id="building" required /> */}
                    <select name="building" id="building" onChange={(e) => { setSelectedBuilding(parseInt(e.currentTarget.value)) }} value={selectedBuilding} required>
                        {db.buildings.map((object) => <option value={object.id}>{object.name}</option>)}
                    </select>
                </div>}
                {["item", "shelf"].includes(objectType) && <div className="flex flex-row align-middle">
                    <label htmlFor="area">Area: </label>
                    {/* <input type="number" name="area" id="area" required /> */}
                    <select name="area" id="area" onChange={(e) => { setSelectedArea(parseInt(e.currentTarget.value)) }} value={selectedArea} required>
                        {db.areas.map((object) => {
                            if (object.building === selectedBuilding) {
                                return <option value={object.id}>{object.name}</option>;
                            }
                            return "";
                        })}
                    </select>
                </div>}
                {["item"].includes(objectType) && <div className="flex flex-row align-middle">
                    <label htmlFor="shelf">Shelf: </label>
                    {/* <input type="number" name="shelf" id="shelf" required /> */}
                    <select name="shelf" id="shelf" required>
                        {db.shelves.map((object) => {
                            if (object.area === selectedArea) {
                                return <option value={object.id}>{object.name}</option>;
                            }
                            return "";
                        })}
                    </select>
                </div>}
                {objectType === "item" && <div className="flex flex-row align-middle">
                    <label htmlFor="slot">Slot: </label>
                    <input type="number" name="slot" id="slot" required />
                </div>}
                <button type="submit" className="p-2 rounded-full bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Create</button>
            </form>
        </div>
    );
}

export default CreateObject;