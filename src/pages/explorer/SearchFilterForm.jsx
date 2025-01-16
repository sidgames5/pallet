function SearchFilterForm(props) {
    const buildings = props.buildings;
    const areas = props.areas;
    const shelves = props.shelves;

    return (
        <form className="search-filters flex flex-row justify-center items-center gap-8 m-4">
            <div className="flex flex-col items-center">
                <label htmlFor="building">Building</label>
                <select name="building" id="building">
                    {buildings.map((object) => <option value={object.id}>{object.name}</option>)}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <label htmlFor="area">Room</label>
                <select name="area" id="area">
                    {areas.map((object) => <option value={object.id}>{object.name}</option>)}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <label htmlFor="shelf">Shelf</label>
                <select name="shelf" id="shelf">
                    {shelves.map((object) => <option value={object.id}>{object.name}</option>)}
                </select>
            </div>
            <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
        </form>
    );
}

export default SearchFilterForm;