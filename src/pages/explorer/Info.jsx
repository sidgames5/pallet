import { Link, useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import NoPage from "../NoPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDoorOpen, faPallet, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

function Info() {
    const { objectType, objectId } = useParams();
    const navigate = useNavigate();
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [effectObjDone, setEffectObjDone] = useState(false);
    const [effectLocationsDone, setEffectLocationsDone] = useState(false);
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

    // const locations = Database.resolveLocations(object); 

    const [obj, setObj] = useState(null);
    // let obj = (function (type, id, database) {
    //     if (!db || !type || !id) {
    //         console.error('Missing required data:', { db, type, id });
    //         return null;
    //     }
    //     switch (type) {
    //         case "item":
    //             for (const v of database.items) {
    //                 if (v.id === parseInt(id)) {
    //                     return v;
    //                 }
    //             }
    //             break;
    //         case "building":
    //             for (const v of database.buildings) {
    //                 if (v.id === parseInt(id)) {
    //                     return v;
    //                 }
    //             }
    //             break;
    //         case "area":
    //             for (const v of database.areas) {
    //                 if (v.id === parseInt(id)) {
    //                     return v;
    //                 }
    //             }
    //             break;
    //         case "shelf":
    //             for (const v of database.shelves) {
    //                 if (v.id === parseInt(id)) {
    //                     return v;
    //                 }
    //             }
    //             break;
    //         default:
    //             return null;
    //     }
    //     return null;
    // })(objectType, objectId, db);
    useEffect(() => {
        if (db && objectType && objectId) {
            const result = (function (type, id) {
                switch (type) {
                    case "item":
                        return db.items.find(v => v.id === parseInt(id)) || null;
                    case "building":
                        return db.buildings.find(v => v.id === parseInt(id)) || null;
                    case "area":
                        return db.areas.find(v => v.id === parseInt(id)) || null;
                    case "shelf":
                        return db.shelves.find(v => v.id === parseInt(id)) || null;
                    default:
                        return null;
                }
            })(objectType, objectId);

            setObj(result);
            setEffectObjDone(true);
        }
    }, [db, objectType, objectId]);

    const [locations, setLocations] = useState({});
    useEffect(() => {

        if (!obj || !db) {
            console.log("Object or database is null");
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await Database.resolveLocations(obj);
                if (isMounted) {
                    setLocations(data);
                    setEffectLocationsDone(true);
                }
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                if (isMounted) {
                    setEffectLocationsDone(true);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [obj, db]);

    if (!effectDbDone && !effectLocationsDone && !effectObjDone) {
        return <div>Loading</div>;
    }

    return (obj == null) ? <NoPage /> : (<div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-row gap-4 items-center">
            <FontAwesomeIcon icon={faArrowLeft} className="size-8 p-2 bg-gray-700 rounded-full text-white cursor-pointer transition-all duration-300 hover:bg-sky-600" onClick={() => navigate(-1)} />
            <h3>{String(objectType).charAt(0).toUpperCase() + String(objectType).slice(1)} {objectId}: {obj.name}</h3>
        </div>
        <div className="flex flex-row *:m-2 *:rounded-full *:p-2">
            {objectType === "item" ? <span className={`inline-block ${(function (status) {
                switch (status.replace(" ", "").toLocaleLowerCase()) {
                    case "checkedout":
                        return "bg-red-700";
                    case "available":
                        return "bg-green-700";
                    default:
                        return "bg-gray-700";
                }
            })(obj.status)} text-white`}>{(function (status) {
                switch (status) {
                    case "checkedout":
                        return "Checked out";
                    case "available":
                        return "Available";
                    default:
                        return "Unknown";
                }
            })(obj.status)}</span> : ""}
            {["area", "shelf", "item"].includes(objectType) ? <Link to={`/explorer/building/${locations.buildingId}`} className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faWarehouse} />{locations.building}</Link> : ""}
            {["shelf", "item"].includes(objectType) ? <Link to={`/explorer/area/${locations.areaId}`} className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faDoorOpen} />{locations.area}</Link> : ""}
            {objectType === "item" ? <Link to={`/explorer/shelf/${locations.shelfId}`} className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faPallet} />{locations.shelf}</Link> : ""}
            {objectType === "item" ? <span className="inline-block bg-gray-700 text-white">Slot {obj.slot}</span> : ""}
        </div>
        <div className="grid grid-cols-2 gap-y-10">
            {objectType !== "item" ? <div className="flex flex-col justify-center items-center overflow-y-auto text-wrap">
                {(function () {
                    let parentObject = null;
                    switch (objectType) {
                        case "building":
                            parentObject = db.areas;
                            break;
                        case "area":
                            parentObject = db.shelves;
                            break;
                        case "shelf":
                            parentObject = db.items;
                            break;
                        default:
                            return <p>Error</p>
                    }
                    return parentObject.map((child) => {
                        switch (child.type) {
                            case "area":
                                if (child.building !== obj.id) {
                                    return "";
                                }
                                break;
                            case "shelf":
                                if (child.area !== obj.id) {
                                    return "";
                                }
                                break;
                            case "item":
                                if (child.shelf !== obj.id) {
                                    return "";
                                }
                                break;
                            default:
                                return <p>Error</p>
                        }
                        return <Link to={`/explorer/${child.type}/${child.id}`}>
                            <span>{child.name}</span>
                        </Link>;

                    });
                })()}
            </div> : ""}
            <div className="flex flex-col justify-center items-center mw-[90%]">
                <div className="flex flex-row *:p-2 *:rounded-full *:m-1">
                    {objectType === "item" ? (function () {
                        return (
                            <>
                                {obj.status.replace(" ", "").toLocaleLowerCase() !== "available" ? <button className="bg-green-700 text-white" onClick={() => {
                                    axios.post("/api/edit", {
                                        objectId: objectId,
                                        category: "items",
                                        data: {
                                            status: "available"
                                        }
                                    }).then(() => window.location.reload());
                                }}>Check in</button> : ""}
                                {obj.status.replace(" ", "").toLocaleLowerCase() !== "checkedout" ? <button className="bg-blue-700 text-white" onClick={() => {
                                    axios.post("/api/edit", {
                                        objectId: objectId,
                                        category: "items",
                                        data: {
                                            status: "checkedout"
                                        }
                                    }).then(() => window.location.reload());
                                }}>Check out</button> : ""}
                            </>
                        );
                    })() : ""}
                    <button className="bg-red-700 text-white" onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${objectType}: ${obj.name}`)) {
                            axios.post("/api/delete", {
                                objectId: objectId,
                                category: (function () {
                                    if (objectType === "shelf") {
                                        return "shelves"
                                    } else {
                                        return objectType + "s";
                                    }
                                })()
                            }).then(() => window.location.href = "/explorer");
                        }
                    }}>Delete</button>
                </div>
                <form className="flex flex-col justify-center items-center mt-4">
                    <div className="flex flex-row items-center">
                        <label htmlFor="name">Name: </label>
                        <input type="text" name="name" id="name" value={obj.name} />
                    </div>
                    <button type="submit" className="bg-gray-700 p-2 rounded-full text-white mt-4 hover:bg-sky-600 transition-all duration-300">Update</button>
                </form>
            </div>
            <div className="flex flex-col justify-center items-center mw-[90%]">
                <form className="flex flex-col items-center justify-center gap-1 mt-1" onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: implement moving functionality
                }}>
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
                    <button type="submit" className="p-2 rounded-full bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Move</button>
                </form>
            </div>
        </div>
    </div>);
}

export default Info;