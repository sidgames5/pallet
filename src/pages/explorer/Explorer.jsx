import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Database from "../../utils/Database";
import { Link, useSearchParams } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateObject from "./CreateObject";
import { useState, useEffect } from "react";
import LocationsRow from "./LocationsRow";
import axios from "axios";

function Explorer() {
    const [searchParams] = useSearchParams();

    const [items, setItems] = useState([]);
    useEffect(() => {
        async function fetchAndProcessItems() {
            try {
                const db = await Database.read();
                const filteredItems = db.items.filter(v =>
                    (!searchParams.has("building") || v.building === searchParams.get("building")) &&
                    (!searchParams.has("area") || v.area === searchParams.get("area"))
                );
                const textFilteredItems = filteredItems.filter(v => {
                    if (!searchParams.has("q")) {
                        return true;
                    }
                    return v.name.toLowerCase().includes(searchParams.get("q").toLowerCase());
                });
                setItems([...textFilteredItems].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })));
            } catch (error) {
                console.error("Error fetching or processing items:", error);
                setItems([]);
            }
        }
        fetchAndProcessItems();
    }, [searchParams]);

    const [showCreateObjectModal, setShowCreateObjectModal] = useState(false);

    return (
        <>
            <div className="overflow-x-auto w-full">
                <table className="search-results w-full text-left rtl:text-right table-auto">
                    <thead class="text-white uppercase bg-sky-600">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Building</th>
                            <th>Area</th>
                        </tr>
                    </thead>
                    <tbody className="*:border-gray-700 *:border-b-2 *:border-l-2 *:border-r-2">
                        {items.map((item) => <tr>
                            <td><Link to={`/explorer/item/${item.id}`}>{item.id}</Link></td>
                            <td><Link to={`/explorer/item/${item.id}`}>{item.name}</Link></td>
                            {item.stock != null ? <td>

                                <span className={`inline-block text-white p-1 rounded-lg ${(function () {
                                    if (item.stock > 10) {
                                        return "bg-green-700";
                                    } else if (item.stock > 0) {
                                        return "bg-yellow-700";
                                    } else if (item.stock === 0) {
                                        return "bg-red-700";
                                    }
                                })()}`}>{item.stock} in stock</span>
                            </td> : <td>
                                <span className={`inline-block text-white p-1 rounded-lg mr-2 ${(item.status || "").replace(" ", "").toLocaleLowerCase() === "checkedout" ? "bg-red-700" : "bg-green-700"}`}>
                                    {(item.status || "").replace(" ", "").toLocaleLowerCase() === "checkedout" ? "Checked out" : "Available"}
                                </span>
                                {(item.status || "").replace(" ", "").toLocaleLowerCase() !== "available" && <button className="bg-green-700 text-white p-1 rounded-lg mr-1" onClick={() => {
                                    axios.post("/api/edit", {
                                        objectId: item.id,
                                        category: "items",
                                        data: { status: "available" }
                                    }).then(() => window.location.reload());
                                }}>Check in</button>}
                                {(item.status || "").replace(" ", "").toLocaleLowerCase() !== "checkedout" && <button className="bg-blue-700 text-white p-1 rounded-lg" onClick={() => {
                                    axios.post("/api/edit", {
                                        objectId: item.id,
                                        category: "items",
                                        data: { status: "checkedout" }
                                    }).then(() => window.location.reload());
                                }}>Check out</button>}
                            </td>}
                            <LocationsRow item={item} />
                        </tr>)}
                    </tbody>
                </table>
            </div>

            <FontAwesomeIcon className="fixed bottom-5 right-5 size-10 p-4 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-sky-600 transition-all duration-300" icon={faPlus} onClick={() => setShowCreateObjectModal(true)} />
            {showCreateObjectModal && <CreateObject
                onClose={() => setShowCreateObjectModal(false)}
                onSubmit={(e) => {
                    const formData = new FormData(e.currentTarget);

                    const type = formData.get("type");

                    const requestData = {
                        key: type + "s",
                        data: {}
                    };

                    const isConsumable = Boolean(formData.get("isConsumable"));

                    switch (type) {
                        case "item":
                            requestData.data = {
                                type: "item",
                                id: formData.get("id").trim(),
                                name: formData.get("name"),
                                building: formData.get("building"),
                                area: formData.get("area"),
                                status: isConsumable ? "Unknown" : "available",
                                tags: []
                            };
                            if (isConsumable) {
                                requestData.data.stock = parseInt(formData.get("stock")) || 0;
                            }
                            break;
                        case "area":
                            requestData.data = {
                                type: "area",
                                id: formData.get("id").trim(),
                                name: formData.get("name"),
                                building: formData.get("building")
                            };
                            break;
                        case "building":
                            requestData.data = {
                                type: "building",
                                id: formData.get("id").trim(),
                                name: formData.get("name")
                            };
                            break;
                        default:
                            alert("Invalid data");
                            return;
                    }

                    Database.create(requestData).then(() => {
                        window.location.href = `/explorer/${type}/${requestData.data.id}`;
                    }).catch((error) => {
                        console.error("Error creating object:", error);
                    });
                }} />}
        </>
    );
}

export default Explorer;