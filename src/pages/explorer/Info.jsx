import { Link, useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import NoPage from "../NoPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDoorOpen, faPallet, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function Info() {
    const { objectType, objectId } = useParams();
    const navigate = useNavigate();
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [effectObjDone, setEffectObjDone] = useState(false);
    const [effectLocationsDone, setEffectLocationsDone] = useState(false);
    const [db, setDb] = useState(null);
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
            })(obj.status)} text-white`}>{obj.status}</span> : ""}
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
                    return parentObject.map((child) => <Link to={`/explorer/${child.type}/${child.id}`}>
                        <span>{child.name}</span>
                    </Link>);
                })()}
            </div> : ""}
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row *:p-2 *:rounded-full *:m-1">
                    {objectType === "item" ? (function () {
                        return (
                            <>
                                {obj.status.replace(" ", "").toLocaleLowerCase() !== "available" ? <button className="bg-green-700 text-white">Check in</button> : ""}
                                {obj.status.replace(" ", "").toLocaleLowerCase() !== "checkedout" ? <button className="bg-blue-700 text-white">Check out</button> : ""}
                            </>
                        );
                    })() : ""}
                    <button className="bg-red-700 text-white">Delete</button>
                </div>
                <form className="flex flex-col justify-center items-center mt-4">
                    <div className="flex flex-row items-center">
                        <label htmlFor="name">Name: </label>
                        <input type="text" name="name" id="name" value={obj.name} />
                    </div>
                    <button type="submit" className="bg-gray-700 p-2 rounded-full text-white mt-4 hover:bg-sky-600 transition-all duration-300">Update</button>
                </form>
            </div>
        </div>
    </div>);
}

export default Info;