import { Link, useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import NoPage from "../NoPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDoorOpen, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { ReactBarcode } from "react-jsbarcode";

function Info() {
    const { objectType, objectId } = useParams();
    const navigate = useNavigate();
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [effectObjDone, setEffectObjDone] = useState(false);
    const [effectLocationsDone, setEffectLocationsDone] = useState(false);
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

    const [obj, setObj] = useState(null);
    useEffect(() => {
        if (db && objectType && objectId) {
            const result = (function (type, id) {
                switch (type) {
                    case "item":
                        return db.items.find(v => v.id === id) || null;
                    case "building":
                        return db.buildings.find(v => v.id === id) || null;
                    case "area":
                        return db.areas.find(v => v.id === id) || null;
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

    if (!effectDbDone && !effectLocationsDone && !effectObjDone && !effectSelectionDone) {
        return <div>Loading</div>;
    }

    return (obj == null) ? <NoPage /> : (<div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-row gap-4 items-center">
            <FontAwesomeIcon icon={faArrowLeft} className="size-8 p-2 bg-gray-700 rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-sky-600" onClick={() => navigate(-1)} />
            <h3>{String(objectType).charAt(0).toUpperCase() + String(objectType).slice(1)} {objectId}: {obj.name}</h3>
        </div>
        <div className="flex md:flex-row flex-wrap items-center justify-center *:m-2 *:rounded-lg *:p-2">
            {objectType === "item" ? <span className={`inline-block ${(function (status) {
                if (obj.status == null) {
                    return "bg-gray-700";
                }
                switch (obj.status.replace(" ", "").toLocaleLowerCase()) {
                    case "checkedout":
                        return "bg-red-700";
                    case "available":
                        return "bg-green-700";
                    default:
                        if (obj.stock != null) {
                            if (obj.stock > 10) {
                                return "bg-green-700";
                            } else if (obj.stock > 0) {
                                return "bg-yellow-700";
                            } else if (obj.stock === 0) {
                                return "bg-red-700";
                            }
                        }
                        return "bg-gray-700";
                }
            })(obj.status)} text-white`}>{(function (status) {
                switch ((status || "").replace(" ", "").toLocaleLowerCase()) {
                    case "checkedout":
                        return "Checked out";
                    case "available":
                        return "Available";
                    default:
                        if (obj.stock != null) {
                            return `${obj.stock} in stock`;
                        }
                        return "Status unknown";
                }
            })(obj.status)}</span> : ""}
            {["area", "item"].includes(objectType) ? <Link to={`/explorer/building/${locations.buildingId}`} className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faWarehouse} />{locations.building}</Link> : ""}
            {objectType === "item" ? <Link to={`/explorer/area/${locations.areaId}`} className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faDoorOpen} />{locations.area}</Link> : ""}
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
            {objectType !== "item" ? <div className="flex flex-col justify-center items-center overflow-y-auto text-wrap">
                {(function () {
                    let parentObject = null;
                    switch (objectType) {
                        case "building":
                            parentObject = db.areas;
                            break;
                        case "area":
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
                            case "item":
                                if (objectType === "building" ? child.building !== obj.id : child.area !== obj.id) {
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
                <div className="flex flex-row *:p-2 *:rounded-lg *:m-1">
                    {objectType === "item" ? (function () {
                        if (obj.stock == null) {
                            return (
                                <>
                                    {(obj?.status?.replace(" ", "").toLowerCase() ?? "") !== "available" ? (
                                        <button
                                            className="bg-green-700 text-white"
                                            onClick={() => {
                                                axios.post("/api/edit", {
                                                    objectId: objectId,
                                                    category: "items",
                                                    data: {
                                                        status: "available"
                                                    }
                                                }).then(() => window.location.reload());
                                            }}
                                        >
                                            Check in
                                        </button>
                                    ) : ""}
                                    {(obj?.status?.replace(" ", "").toLowerCase() ?? "") !== "checkedout" ? (
                                        <button
                                            className="bg-blue-700 text-white"
                                            onClick={() => {
                                                axios.post("/api/edit", {
                                                    objectId: objectId,
                                                    category: "items",
                                                    data: {
                                                        status: "checkedout"
                                                    }
                                                }).then(() => window.location.reload());
                                            }}
                                        >
                                            Check out
                                        </button>
                                    ) : ""}
                                </>
                            );
                        } else {
                            return (
                                <>
                                    {(obj?.status?.replace(" ", "").toLowerCase() ?? "") !== "available" ? (
                                        <button
                                            className="bg-green-700 text-white"
                                            onClick={() => {
                                                const count = prompt("How many items to add", 1);
                                                if (count == null) return;
                                                axios.post("/api/edit", {
                                                    objectId: objectId,
                                                    category: "items",
                                                    data: {
                                                        stock: obj.stock + parseInt(count)
                                                    }
                                                }).then(() => window.location.reload());
                                            }}
                                        >
                                            Add stock
                                        </button>
                                    ) : ""}
                                    {(obj?.status?.replace(" ", "").toLowerCase() ?? "") !== "checkedout" ? (
                                        <button
                                            className="bg-blue-700 text-white"
                                            onClick={() => {
                                                const count = prompt("How many items to remove", 1);
                                                if (count == null) return;
                                                axios.post("/api/edit", {
                                                    objectId: objectId,
                                                    category: "items",
                                                    data: {
                                                        stock: Math.max(0, obj.stock - parseInt(count))
                                                    }
                                                }).then(() => window.location.reload());
                                            }}
                                        >
                                            Remove stock
                                        </button>
                                    ) : ""}
                                </>
                            );
                        }
                    })() : ""}
                    <button className="bg-red-700 text-white" onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${objectType}: ${obj.name}`)) {
                            axios.post("/api/delete", {
                                objectId: objectId,
                                category: (function () {
                                    return objectType + "s";
                                })()
                            }).then(() => window.location.href = "/explorer");
                        }
                    }}>Delete</button>
                </div>
                <form className="flex flex-col justify-center items-center mt-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    axios.post("/api/edit", {
                        objectId: objectId,
                        category: (function () {
                            switch (objectType) {
                                case "building":
                                    return "buildings";
                                case "area":
                                    return "areas";
                                case "item":
                                    return "items";
                                default:
                                    return null;
                            }
                        })(),
                        data: {
                            id: formData.get("id").trim(),
                            name: formData.get("name")
                        }
                    }).then(() => {
                        window.location.href = `/explorer/${objectType}/${formData.get("id").trim()}`;
                    }).catch((error) => {
                        console.error("Error updating object:", error);
                    });
                }}>
                    <div className="flex flex-row items-center">
                        <label htmlFor="id">ID: </label>
                        <input type="text" name="id" id="id" defaultValue={obj.id} required />
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="name">Name: </label>
                        <input type="text" name="name" id="name" defaultValue={obj.name} />
                    </div>
                    <button type="submit" className="bg-gray-700 p-2 rounded-lg text-white mt-4 hover:bg-sky-600 transition-all duration-300">Update</button>
                </form>
            </div>
            {objectType !== "building" && <div className="flex flex-col justify-center items-center mw-[90%]">
                <form className="flex flex-col items-center justify-center gap-1 mt-1" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const locationData = {
                        building: formData.get("building")
                    };
                    if (objectType === "item") {
                        locationData.area = formData.get("area");
                    }
                    axios.post("/api/edit", {
                        objectId: objectId,
                        category: (function () {
                            switch (objectType) {
                                case "building":
                                    return "buildings";
                                case "area":
                                    return "areas";
                                case "item":
                                    return "items";
                                default:
                                    return null;
                            }
                        })(),
                        data: locationData
                    }).then(() => window.location.reload());
                }}>
                    {objectType !== "building" && <div className="flex flex-row align-middle">
                        <label htmlFor="building">Building: </label>
                        {/* <input type="number" name="building" id="building" required /> */}
                        <select name="building" id="building" onChange={(e) => { setSelectedBuilding(e.currentTarget.value) }} value={selectedBuilding} required>
                            {db.buildings.map((object) => <option value={object.id}>{object.name}</option>)}
                        </select>
                    </div>}
                    {objectType === "item" && <div className="flex flex-row align-middle">
                        <label htmlFor="area">Area: </label>
                        {/* <input type="number" name="area" id="area" required /> */}
                        <select name="area" id="area" onChange={(e) => { setSelectedArea(e.currentTarget.value) }} value={selectedArea} required>
                            {db.areas.map((object) => {
                                if (object.building === selectedBuilding) {
                                    return <option value={object.id}>{object.name}</option>;
                                }
                                return "";
                            })}
                        </select>
                    </div>}
                    <button type="submit" className="p-2 rounded-lg bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Move</button>
                </form>
            </div>}
            {objectType === "item" && <div className="flex flex-col justify-center items-center mw-[90%]">
                <p>Barcode</p>
                <span className="-z-[1]"><ReactBarcode value={obj.id.toString().padStart(7, "0")} options={{ width: 2, height: 80, flat: true }} /></span>
            </div>}
            {objectType === "item" && (
                <div className="flex flex-col justify-center items-center mw-[90%]">
                    <p>Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {obj.tags.map((tagId, index) => {
                            const tag = db.tags.find((t) => t.id === tagId);
                            return (
                                <span
                                    key={index}
                                    className="bg-gray-700 text-white px-2 py-1 rounded-full flex items-center gap-2"
                                >
                                    <Link
                                        to={`/tags/${tagId}`}
                                        className="text-white hover:underline"
                                    >
                                        {tag?.name || "Unknown"}
                                    </Link>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => {
                                            axios.post("/api/edit", {
                                                objectId: objectId,
                                                category: "items",
                                                data: {
                                                    tags: obj.tags.filter((t) => t !== tagId),
                                                },
                                            }).then(() => window.location.reload());
                                        }}
                                    >
                                        &times;
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                    <form
                        className="flex flex-col items-center mt-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newTagId = formData.get("newTag").trim();
                            if (!newTagId || obj.tags.includes(newTagId)) return;

                            axios.post("/api/edit", {
                                objectId: objectId,
                                category: "items",
                                data: {
                                    tags: [...obj.tags, newTagId],
                                },
                            }).then(() => window.location.reload());
                        }}
                    >
                        <input
                            type="text"
                            name="newTag"
                            placeholder="Search for a tag"
                            className="p-2 border rounded-lg w-full"
                            list="tags-list"
                        />
                        <datalist id="tags-list">
                            {db.tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </datalist>
                        <button
                            type="submit"
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg mt-2 hover:bg-sky-600 transition-all duration-300"
                        >
                            Add Tag
                        </button>
                    </form>
                </div>
            )}
        </div>
    </div>);
}

export default Info;