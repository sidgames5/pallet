import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Database from "../../utils/Database";

function LocationsRow(props) {
    const item = props.item;
    const [locations, setLocations] = useState({
        building: "",
        area: "",
        shelf: ""
    });
    useEffect(() => {
        Database.resolveLocations(item)
            .then(resolvedLocations => {
                setLocations(resolvedLocations);
            })
            .catch(error => console.error("Error: ", error));
    }, [item]);
    return (
        <>
            <td><Link to={`/explorer/building/${item.building}`}>{locations.building}</Link></td>
            <td><Link to={`/explorer/area/${item.area}`}>{locations.area}</Link></td>
            <td><Link to={`/explorer/shelf/${item.shelf}`}>{locations.shelf}</Link></td>
        </>
    );
}
export default LocationsRow;