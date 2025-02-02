export default function SearchTextForm() {
    return (
        <form className="search-filters flex flex-row justify-center items-center gap-8 m-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            window.location.href = `/explorer?q=${formData.get("query")}`;
        }}>
            <div className="flex flex-col items-center">
                <input type="text" name="query" id="query" required />
            </div>
            <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
        </form>
    );
}