class Database {
    static read() {
        return {
            buildings: [{
                type: "building",
                name: "Warehouse A",
                id: 4
            }],
            area: [{
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
                building: 4
            }]
        };
    }
}

export default Database;