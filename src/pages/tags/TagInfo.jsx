import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LocationsRow from "../explorer/LocationsRow";

export default function TagInfo() {
    const [db, setDb] = useState(null);
    const [effectDbDone, setEffectDbDone] = useState(false);
    const { tagId } = useParams();
    const [tag, setTag] = useState(null);
    const navigate = useNavigate();

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
        if (db && effectDbDone) {
            const tag = db.tags.find(tag => tag.id === tagId);
            if (tag) {
                setTag(tag);
            } else {
                console.error("Tag not found");
            }
        }
    }, [db, effectDbDone, tagId]);

    return <div className="w-full">
        {tag ? (
            <div className="flex flex-col items-center w-full gap-4">
                <div className="flex flex-row items-center gap-4">
                    <FontAwesomeIcon icon={faArrowLeft} className="size-8 p-2 bg-gray-700 rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-sky-600" onClick={() => navigate(-1)} />
                    <div
                        className="p-4 rounded-full w-8 h-8"
                        style={{ backgroundColor: tag.color }}
                    ></div>
                    <div className="flex flex-col">

                        <h1 className="text-2xl font-bold">{tag.name}</h1>
                        <p>{tag.description}</p>
                    </div>
                </div>
                <form className="flex flex-row items-center gap-2" onSubmit={(e) => {
                    e.preventDefault();
                    const newId = new FormData(e.currentTarget).get("id").trim();
                    axios.post("/api/edit", {
                        objectId: tagId,
                        category: "tags",
                        data: { id: newId }
                    }).then(() => {
                        window.location.href = `/tags/${newId}`;
                    }).catch((error) => {
                        console.error("Error updating tag ID:", error);
                    });
                }}>
                    <label htmlFor="tag-id">ID: </label>
                    <input type="text" name="id" id="tag-id" defaultValue={tag.id} required />
                    <button type="submit" className="bg-gray-700 p-2 rounded-lg text-white hover:bg-sky-600 transition-all duration-300">Update ID</button>
                </form>

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
                            {db.items.filter((item) => item.tags && item.tags.includes(tagId))
                                .map((item) => <tr>
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
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>;
}