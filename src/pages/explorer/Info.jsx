import { useParams } from "react-router-dom";
import Database from "../../utils/Database";

function Info() {
    const { objectType, objectId } = useParams();
    let object = (function(type, id) {
        const db = Database.read();
        switch (type) {
            case "item":
                for (const v of db.items) {
                    if (v.id === objectId) {
                        return v;
                    }
                }
                break;
            default:
                return null;
        }
        return null;
    })(objectType, objectId);
    return <h1>Info</h1>;
}

export default Info;