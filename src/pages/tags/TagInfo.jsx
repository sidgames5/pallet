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
            const tag = db.tags.find(tag => tag.id === parseInt(tagId));
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

                <div className="overflow-x-auto w-full">
                    <table className="search-results w-full text-left rtl:text-right table-auto">
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
                            {db.items.filter((item) => item.tags && item.tags.includes(parseInt(tagId)))
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
                                    </td> : <td><select className={`inline-block ${(function (status) {
                                        switch (status.replace(" ", "").toLocaleLowerCase()) {
                                            case "checkedout":
                                                return "bg-red-700";
                                            case "available":
                                                return "bg-green-700";
                                            default:
                                                return "bg-gray-700";
                                        }
                                    })(item.status)} text-white p-1 rounded-lg cursor-pointer`} onChange={(e) => {
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
                                    })(item.status)}</select></td>}
                                    <LocationsRow item={item} />
                                    <td>{item.slot}</td>
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