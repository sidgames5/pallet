class Database {
    static read() {
        return {
            buildings: [{
                type: "building",
                name: "Warehouse A",
                id: 4
            }],
            areas: [{
                type: "area",
                name: "Storage Room",
                id: 3
            }],
            shelves: [{
                type: "shelf",
                name: "A7",
                id: 2
            }],
            items: [{
                type: "item",
                name: "Test",
                id: 1,
                status: "Unknown",
                shelf: 2,
                area: 3,
                building: 4,
                slot: 15
            }]
        };
    }

    static resolveLocations(itemId) {
        let building = null;
        let buildingId = 0;
        let area = null;
        let areaId = 0;
        let shelf = null;
        let shelfId = 0;

        let item = null;
        for (const element of Database.read().items) {
            console.log(element);
            if (element.id === itemId) {
                item = element;
                buildingId = item.building;
                areaId = item.area;
                shelfId = item.shelf;
            }
        }

        for (const element of Database.read().buildings) {
            if (element.id === buildingId) {
                building = element.name;
            }
        }

        for (const element of Database.read().areas) {
            if (element.id === areaId) {
                area = element.name;
            }
        }

        for (const element of Database.read().shelves) {
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
    }
}

export default Database;