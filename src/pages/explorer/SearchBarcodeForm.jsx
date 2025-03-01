import { faCamera, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import BarcodeScanModal from "./BarcodeScanModal";

function ErrorPopup({ text }) {
    return <div className="p-4 m-2 bg-orange-500 rounded-lg">
        <p><FontAwesomeIcon icon={faWarning} />{text}</p>
    </div>
}

function SearchBarcodeForm() {
    const [errorText, setErrorText] = useState("");
    const [hasError, setHasError] = useState(false);
    const [barcodeScanModalVisible, setBarcodeScanModalVisible] = useState(false);
    let id = 0;
    return (
        <>
            <form className="search-filters flex flex-row justify-center items-center gap-8 m-4" onSubmit={(e) => {
                e.preventDefault();
                axios.get("/api/read").then((res) => {
                    let found = false;
                    for (let o of res.data.items) {
                        if (o.id === id) {
                            found = true;
                            window.location.href = `/explorer/item/${id}`;
                        }
                    }
                    if (!found) {
                        setErrorText(`No item with id ${id} found`);
                        setHasError(true);
                    }
                })
            }}>
                <div className="flex flex-col items-center">
                    <label htmlFor="id">Barcode or ID</label>
                    <div className="relative">
                        <input type="number" name="id" id="id" required onChange={(e) => id = parseInt(e.currentTarget.value)} />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" onClick={() => { setBarcodeScanModalVisible(true) }}><FontAwesomeIcon icon={faCamera} /></span>
                    </div>
                </div>
                <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
            </form>
            {hasError && <ErrorPopup text={errorText} />}
            {barcodeScanModalVisible && <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <BarcodeScanModal />
            </div>}
        </>
    );
}

export default SearchBarcodeForm;