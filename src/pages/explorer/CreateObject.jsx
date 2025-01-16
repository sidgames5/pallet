import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CreateObject(props) {
    return (
        <div className="bg-gray-300 p-8 rounded-lg fixed flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-row items-center align-middle justify-center">
                <FontAwesomeIcon className="mr-4 p-2 size-4 bg-gray-700 rounded-full text-white hover:bg-sky-600 transition-all duration-300" icon={faClose} onClick={props.onClose} />
                <h6>Create new entry</h6>
            </div>
            <form className="flex flex-col items-center justify-center gap-1 mt-1" onSubmit={(e) => {
                e.preventDefault();
                props.onSubmit();
            }}>
                <div className="flex flex-row align-middle">
                    <label htmlFor="type">Type: </label>
                    <select name="type" id="type">
                        <option value="item">Item</option>
                        <option value="shelf">Shelf</option>
                        <option value="area">Area</option>
                        <option value="building">Building</option>
                    </select>
                </div>
                <div className="flex flex-row align-middle">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" id="name" />
                </div>
                <div className="flex flex-row align-middle">
                    <label htmlFor="slot">Slot: </label>
                    <input type="number" name="slot" id="slot" />
                </div>
                <button type="submit" className="p-2 rounded-full bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Create</button>
            </form>
        </div>
    );
}

export default CreateObject;