export default function BarcodePage() {
    return <div>
        <div>
            {/* Options */}
            <form onSubmit={(e) => {
                const formData = new FormData(e.target);

                // TODO
            }}>
                <div className="flex flex-row align-middle">
                    <label htmlFor="startNum">Starting Number: </label>
                    <input type="number" name="startNum" id="startNum" min={0} defaultValue={0} />
                </div>

                <div className="flex flex-row align-middle">
                    <label htmlFor="endNum">Ending Number: </label>
                    <input type="number" name="endNum" id="endNum" min={0} defaultValue={100} />
                </div>

                <div className="flex flex-row align-middle">
                    <label htmlFor="showBarcode">Show Barcode: </label>
                    <input type="checkbox" name="showBarcode" id="showBarcode" defaultChecked={true} />
                </div>

                <div className="flex flex-row align-middle">
                    <label htmlFor="barcodeSize">Barcode Size: </label>
                    <select name="barcodeSize" id="barcodeSize">
                        <option value={0}>Tiny</option>
                        <option value={1}>Small</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Large</option>
                    </select>
                </div>

                <div className="flex flex-row align-middle">
                    <label htmlFor="showId">Show ID: </label>
                    <input type="checkbox" name="showId" id="showId" defaultChecked={true} />
                </div>

                <div className="flex flex-row align-middle">
                    <label htmlFor="cuttingLines">Cutting Lines: </label>
                    <input type="checkbox" name="cuttingLines" id="cuttingLines" defaultChecked={false} />
                </div>

                <button type="submit" className="p-2 rounded-lg bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Generate</button>
            </form>
        </div>
    </div>;
}