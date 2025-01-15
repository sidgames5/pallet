function Explorer() {
    return (
        <table className="search-results w-full text-left rtl:text-right">
            <thead class="text-white uppercase bg-sky-600">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Building</th>
                    <th>Room</th>
                    <th>Shelf</th>
                    <th>Slot</th>
                </tr>
            </thead>
            <tbody className="*:border-gray-700 *:border-b-2 *:border-l-2 *:border-r-2">
                <tr>
                    <td>1</td>
                    <td>Test</td>
                    <td>Unknown</td>
                    <td>Warehouse A</td>
                    <td>Storage Room</td>
                    <td>A7</td>
                    <td>15</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Test</td>
                    <td>Unknown</td>
                    <td>Warehouse A</td>
                    <td>Storage Room</td>
                    <td>A7</td>
                    <td>15</td>
                </tr>
            </tbody>
        </table>
    );
}

export default Explorer;