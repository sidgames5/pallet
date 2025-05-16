import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CreateTag({ onSubmit, onClose }) {
    return (
        <div className="bg-gray-300 p-8 rounded-lg fixed flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-row items-center align-middle justify-center">
                <FontAwesomeIcon className="mr-4 p-2 size-4 bg-gray-700 rounded-lg text-white hover:bg-sky-600 transition-all duration-300 cursor-pointer" icon={faClose} onClick={onClose} />
                <h6>Create new tag</h6>
            </div>
            <form className="flex flex-col items-center justify-center gap-1 mt-1" onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
            }}>
            <div className="flex flex-row align-middle">
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" id="name" required />
            </div>
                <div className="flex flex-row align-middle">
                    <label htmlFor="description">Description: </label>
                    <input type="text" name="description" id="description" required />
                </div>
                <div className="flex flex-row align-middle">
                    <label htmlFor="color">Color: </label>
                    <select name="color" id="color" required>
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="yellow">Yellow</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                        <option value="gray">Gray</option>
                    </select>
                </div>
                <button type="submit" className="p-2 rounded-lg bg-gray-700 hover:bg-sky-600 transition-all duration-300 text-white">Create</button>
            </form>
        </div>
    );
}