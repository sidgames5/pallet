import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Database from "../../utils/Database";
import { Link } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Explorer() {
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
                    {Database.read().items.map((item) => <tr>
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
                        })(item.status)} text-white p-1 rounded-full`} onChange={console.log("changed!")}>{(function (status) {
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
                        <td><Link to={`/explorer/building/${item.building}`}>{Database.resolveLocations(item.id).building}</Link></td>
                        <td><Link to={`/explorer/area/${item.area}`}>{Database.resolveLocations(item.id).area}</Link></td>
                        <td><Link to={`/explorer/shelf/${item.shelf}`}>{Database.resolveLocations(item.id).shelf}</Link></td>
                        <td>{item.slot}</td>
                    </tr>)}
                </tbody>
            </table>

            <FontAwesomeIcon className="fixed bottom-5 right-5 size-10 p-4 bg-gray-700 text-white rounded-full cursor-pointer hover:m-1 transition-all duration-300" icon={faPlus} />
        </>
    );
}

export default Explorer;