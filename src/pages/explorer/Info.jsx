import { useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import NoPage from "../NoPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDoorOpen, faPallet, faWarehouse } from "@fortawesome/free-solid-svg-icons";

function Info() {
    const { objectType, objectId } = useParams();
    let object = (function (type, id) {
        const db = Database.read();
        switch (type) {
            case "item":
                for (const v of db.items) {
                    if (v.id === parseInt(id)) {
                        return v;
                    }
                }
                break;
            case "building":
                for (const v of db.buildings) {
                    if (v.id === parseInt(id)) {
                        return v;
                    }
                }
                break;
            case "area":
                for (const v of db.areas) {
                    if (v.id === parseInt(id)) {
                        return v;
                    }
                }
                break;
            case "shelf":
                for (const v of db.shelves) {
                    if (v.id === parseInt(id)) {
                        return v;
                    }
                }
                break;
            default:
                return null;
        }
        return null;
    })(objectType, objectId);

    const navigate = useNavigate();

    const locations = Database.resolveLocations(object.id);

    return (object == null) ? <NoPage /> : (<div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-row gap-4 items-center">
            <FontAwesomeIcon icon={faArrowLeft} className="size-8 p-2 bg-gray-700 rounded-full text-white cursor-pointer transition-all duration-300 hover:bg-sky-600" onClick={() => navigate(-1)} />
            <h3>{String(objectType).charAt(0).toUpperCase() + String(objectType).slice(1)} {objectId}: {object.name}</h3>
        </div>
        <div className="flex flex-row *:m-2 *:rounded-full *:p-2">
            {objectType === "item" ? <span className={`inline-block ${(function (status) {
                switch (status.replace(" ", "").toLocaleLowerCase()) {
                    case "checkedout":
                        return "bg-red-700";
                    case "available":
                        return "bg-green-700";
                    default:
                        return "bg-gray-700";
                }
            })(object.status)} text-white`}>{object.status}</span> : ""}
            {["area", "shelf", "item"].includes(objectType) ? <span className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faWarehouse} />{locations.building}</span> : ""}
            {["shelf", "item"].includes(objectType) ? <span className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faDoorOpen} />{locations.area}</span> : ""}
            {objectType === "item" ? <span className="inline-block bg-gray-700 text-white *:mr-1"><FontAwesomeIcon icon={faPallet} />{locations.shelf}</span> : ""}
            {objectType === "item" ? <span className="inline-block bg-gray-700 text-white">Slot {object.slot}</span> : ""}
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