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
                    (!searchParams.has("building") || v.building === parseInt(searchParams.get("building"))) &&
                    (!searchParams.has("area") || v.area === parseInt(searchParams.get("area"))) &&
                    (!searchParams.has("shelf") || v.shelf === parseInt(searchParams.get("shelf")))
                );
                const textFilteredItems = filteredItems.filter(v => {
                    if (!searchParams.has("q")) {
                        return true;
                    }
                    return v.name.toLowerCase().includes(searchParams.get("q").toLowerCase());
                });
                setItems(textFilteredItems);
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
            <table className="search-results w-full text-left rtl:text-right">
                <thead class="text-white uppercase bg-sky-600">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Building</th>
                        <th>Area</th>
                        <th>Shelf</th>
                        <th>Slot</th>
                    </tr>
                </thead>
                <tbody className="*:border-gray-700 *:border-b-2 *:border-l-2 *:border-r-2">
                    {items.map((item) => <tr>
                        <td><Link to={`/explorer/item/${item.id}`}>{item.id}</Link></td>
                        <td><Link to={`/explorer/item/${item.id}`}>{item.name}</Link></td>
                        <td><select className={`inline-block ${(function (status) {
                            switch (status.replace(" ", "").toLocaleLowerCase()) {
                                case "checkedout":
                                    return "bg-red-700";
                                case "available":
                                    return "bg-green-700";
                                default:
                                    return "bg-gray-700";
                            }
                        })(item.status)} text-white p-1 rounded-full cursor-pointer`} onChange={(e) => {
                            axios.post("/api/edit", {
                                objectId: item.id,
                                category: "items",
                                data: {
                                    status: e.currentTarget.value
                                }
                            }).then(() => window.location.reload());
                        }}>{(function (status) {
                            const options = [];
                            const defaults = ["available", "checkedout", "unknown"]
                            options.push(status.toLocaleLowerCase().replace(" ", ""));
                            for (const o of defaults) {
                                if (!options.includes(o)) {
                                    options.push(o);
                                }
                            }

                            const things = [];

                            for (const o of options) {
                                switch (o) {
                                    case "checkedout":
                                        things.push(<option value="checkedout">Checked out</option>);
                                        break;
                                    case "available":
                                        things.push(<option value="available">Available</option>);
                                        break;
                                    default:
                                        things.push(<option value="unknown">Unknown</option>);
                                        break;
                                }
                            }

                            return things;
                        })(item.status)}</select></td>
                        <LocationsRow item={item} />
                        <td>{item.slot}</td>
                    </tr>)}
                </tbody>
            </table>

            <FontAwesomeIcon className="fixed bottom-5 right-5 size-10 p-4 bg-gray-700 text-white rounded-full cursor-pointer hover:bg-sky-600 transition-all duration-300" icon={faPlus} onClick={() => setShowCreateObjectModal(true)} />
            {showCreateObjectModal && <CreateObject
                onClose={() => setShowCreateObjectModal(false)}
                onSubmit={(e) => {
                    const formData = new FormData(e.currentTarget);

                    const type = formData.get("type");

                    const requestData = {
                        key: (function () {
                            if (type === "shelf") {
                                return "shelves"
                            } else {
                                return type + "s";
                            }
                        })(),
                        data: {}
                    };

                    switch (type) {
                        case "item":
                            requestData.data = {
                                type: "item",
                                name: formData.get("name"),
                                building: parseInt(formData.get("building")),
                                area: parseInt(formData.get("area")),
                                shelf: parseInt(formData.get("shelf")),
                                slot: parseInt(formData.get("slot")),
                                status: "Unknown"
                            };
                            break;
                        case "shelf":
                            requestData.data = {
                                type: "shelf",
                                name: formData.get("name"),
                                building: parseInt(formData.get("building")),
                                area: parseInt(formData.get("area"))
                            };
                            break;
                        case "area":
                            requestData.data = {
                                type: "area",
                                name: formData.get("name"),
                                building: parseInt(formData.get("building"))
                            };
                            break;
                        case "building":
                            requestData.data = {
                                type: "building",
                                name: formData.get("name")
                            };
                            break;
                        default:
                            alert("Invalid data");
                            return;
                    }

                    Database.create(requestData);
                    Database.read().then((d) => {
                        let path = `/explorer/${type}/`;
                        switch (type) {
                            case "item":
                                path += d.items[d.items.length - 1].id;
                                break;
                            case "shelf":
                                path += d.shelves[d.shelves.length - 1].id;
                                break;
                            case "area":
                                path += d.areas[d.areas.length - 1].id;
                                break;
                            case "building":
                                path += d.buildings[d.buildings.length - 1].id;
                                break;
                            default:
                                alert("Invalid data");
                                return;
                        }
                        window.location.href = path;
                    })
                }} />}
        </>
    );
}

export default Explorer;