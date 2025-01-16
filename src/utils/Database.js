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

    static resolveLocations(obj) {
        let building = null;
        let buildingId = 0;
        let area = null;
        let areaId = 0;
        let shelf = null;
        let shelfId = 0;

        let item = obj;
        buildingId = item.building;
        areaId = item.area;
        shelfId = item.shelf;

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

            for (const element of db.shelves) {
                if (element.id === shelfId) {
                    shelf = element.name;
                }
            }

            return {
                building: building,
                buildingId: buildingId,
                area: area,
                areaId: areaId,
                shelf: shelf,
                shelfId: shelfId
            };
        });
    }
}

export default Database;