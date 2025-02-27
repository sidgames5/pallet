import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";

function ErrorPopup({text}) {
    return <div className="p-4 m-2 bg-orange-500 rounded-lg">
        <p><FontAwesomeIcon icon={faWarning}/>{text}</p>
    </div>
}

function SearchBarcodeForm() {
    const [errorText, setErrorText] = useState("");
    const [hasError, setHasError] = useState(false);
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
                <input type="number" name="id" id="id" required onChange={(e) => id = parseInt(e.currentTarget.value)} />
            </div>
            <button type="submit" className="p-4 bg-gray-700 rounded-lg text-white transition-all duration-300 hover:bg-sky-600">Search</button>
        </form>
        {hasError && <ErrorPopup text={errorText}/>}
        </>
    );
}

export default SearchBarcodeForm;