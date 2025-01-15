import { useParams } from "react-router-dom";
import Database from "../../utils/Database";
import NoPage from "../../NoPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faPallet, faWarehouse } from "@fortawesome/free-solid-svg-icons";

function Info() {
    const { objectType, objectId } = useParams();
    let object = (function (type, id) {
        const db = Database.read();
        switch (type) {
            case "item":
                for (const v of db.items) {
                    if (v.id === id) {
                        return v;
                    }
                }
                break;
            case "building":
                for (const v of db.buildings) {
                    if (v.id === id) {
                        return v;
                    }
                }
                break;
            case "room":
                for (const v of db.rooms) {
                    if (v.id === id) {
                        return v;
                    }
                }
                break;
            case "shelf":
                for (const v of db.shelves) {
                    if (v.id === id) {
                        return v;
                    }
                }
                break;
            default:
                return null;
        }
        return null;
    })(objectType, objectId);
    return (object == null) ? <NoPage /> : (<div className="w-full flex flex-col">
        <h1>{String(objectType).charAt(0).toUpperCase() + String(objectType).slice(1)} {objectId}: {object.name}</h1>
        <div className="flex flex-row">
            {objectType === "item" ? <span className="inline-block p-4 bg-gray-700 text-white">{object.status}</span> : ""}
            {objectType === "room" | "shelf" | "item" ? <span className="inline-block p-4 bg-gray-700"><FontAwesomeIcon icon={faWarehouse} />{object.building}</span> : ""}
            {objectType === "shelf" | "item" ? <span className="inline-block p-4 bg-gray-700"><FontAwesomeIcon icon={faDoorOpen} />{object.room}</span> : ""}
            {objectType === "item" ? <span className="inline-block p-4 bg-gray-700"><FontAwesomeIcon icon={faPallet} />{object.shelf}</span> : ""}
            {objectType === "item" ? <span className="inline-block p-4 bg-gray-700">Slot {object.slot}</span> : ""}
        </div>
        <div className="grid grid-cols-2 gap-y-10">
            <div>
                {/* TODO: History */}
            </div>
            <div>
                {/* TODO: Actions */}
            </div>
        </div>
    </div>);
}

export default Info;