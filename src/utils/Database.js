import axios from "axios";

class Database {
    static async read() {
        let data = {};
        try {
            const res = await axios.get("/api/read");
            data = res.data;
            return data;
        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    }

    static create(data) {
        return axios.post("/api/create", data);
    }

    static resolveLocations(obj) {
        let building = null;
        let buildingId = null;
        let area = null;
        let areaId = null;

        if (obj == null || obj === undefined) {
            console.warn("Null object provided");
            return null;
        }

        buildingId = obj.building;
        areaId = obj.area;

        return Database.read().then((db) => {
            for (const element of db.buildings) {
                if (element.id === buildingId) {
                    building = element.name;
                }
            }

            for (const element of db.areas) {
                if (element.id === areaId) {
                    area = element.name;
                }
            }

            return {
                building: building,
                buildingId: buildingId,
                area: area,
                areaId: areaId
            };
        });
    }
}

export default Database;