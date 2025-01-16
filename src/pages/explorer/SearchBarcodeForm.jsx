function SearchBarcodeForm() {
    let id = 0;
    return (
        <form className="search-filters flex flex-row justify-center items-center gap-8 m-4" onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/explorer/item/${id}`;
        }}>
            <div className="flex flex-col items-center">
                <label htmlFor="id">Barcode or ID</label>
                <input type="number" name="id" id="id" required onChange={(e) => id = e.currentTarget.value} />
            </div>
            <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
        </form>
    );
}

export default SearchBarcodeForm;