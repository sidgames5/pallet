import Database from "../../utils/Database";

function Explorer() {
    return (
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
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                    <td>{Database.resolveLocations(item.id).building}</td>
                    <td>{Database.resolveLocations(item.id).area}</td>
                    <td>{Database.resolveLocations(item.id).shelf}</td>
                    <td>{item.slot}</td>
                </tr>)}
            </tbody>
        </table>
    );
}

export default Explorer;