import csv
import io

from flask import Flask, jsonify, request

from backend.database import Database

app = Flask(__name__)


@app.route("/api/read")
def read():
    return jsonify(Database.data)


@app.route("/api/check-bom", methods=["POST"])
def check_bom():
    options = request.get_json(silent=True) or {}
    if not isinstance(options, dict):
        return "A JSON object is required", 400
    csv_text = options.get("csv")
    id_column = options.get("idColumn")
    quantity_column = options.get("quantityColumn")

    if not isinstance(csv_text, str) or not csv_text.strip():
        return "CSV data is required", 400
    if not isinstance(id_column, str) or not isinstance(quantity_column, str):
        return "ID and quantity columns are required", 400

    try:
        rows = csv.DictReader(io.StringIO(csv_text))
        if not rows.fieldnames:
            return "CSV header is required", 400
        normalized_fields = {field.strip(): field for field in rows.fieldnames if field is not None}
        if id_column not in normalized_fields or quantity_column not in normalized_fields:
            return "Selected columns were not found in the CSV header", 400
        id_field = normalized_fields[id_column]
        quantity_field = normalized_fields[quantity_column]

        requirements = {}
        for line_number, row in enumerate(rows, start=2):
            item_id = (row.get(id_field) or "").strip()
            raw_quantity = (row.get(quantity_field) or "").strip()
            if not item_id and not raw_quantity:
                continue
            if not item_id:
                return f"Missing item ID on row {line_number}", 400
            try:
                quantity = float(raw_quantity)
            except ValueError:
                return f"Invalid quantity on row {line_number}", 400
            if quantity <= 0 or not quantity.is_integer():
                return f"Quantity on row {line_number} must be a positive whole number", 400
            requirements[item_id] = requirements.get(item_id, 0) + int(quantity)
    except csv.Error as error:
        return f"Invalid CSV: {error}", 400

    inventory = {str(item.get("id")): item for item in Database.data.get("items", [])}
    restock = []
    for item_id, required in requirements.items():
        item = inventory.get(item_id)
        stock = item.get("stock") if item else 0
        stock = stock if isinstance(stock, (int, float)) and stock >= 0 else 0
        if required > stock:
            restock.append({
                "id": item_id,
                "name": item.get("name", "Unknown item") if item else "Item not found",
                "required": required,
                "stock": stock,
                "restock": required - stock,
                "found": item is not None,
            })

    return jsonify({
        "restock": restock,
        "checked": len(requirements),
        "ready": len(restock) == 0,
    })


@app.route("/api/create", methods=["POST"])
def create():
    opts = request.json
    key = None
    data = None
    try:
        key = opts["key"]
        data = opts["data"]
    except Exception:
        pass
    if key is None or data is None:
        return "Bad request", 400
    object_id = data.get("id")
    if not isinstance(object_id, str) or not object_id.strip():
        return "A non-empty string id is required", 400
    if key not in Database.data:
        return "Unknown category", 400
    object_id = object_id.strip()
    if any(value.get("id") == object_id for value in Database.data[key]):
        return "ID already exists", 409
    data["id"] = object_id.strip()
    Database.data[key].append(data)
    Database.save()
    return "OK", 201


@app.route("/api/edit", methods=["POST"])
def edit():
    opts = request.json
    object_id = opts["objectId"]
    data = opts["data"]
    category = opts["category"]
    if category not in Database.data or not isinstance(object_id, str):
        return "Bad request", 400
    index = -1
    for i, v in enumerate(Database.data[category]):
        if v["id"] == object_id:
            index = i
    if index == -1:
        return "Not found", 404

    new_id = data.get("id")
    if new_id is not None:
        if not isinstance(new_id, str) or not new_id.strip():
            return "A non-empty string id is required", 400
        new_id = new_id.strip()
        if any(value.get("id") == new_id for value in Database.data[category] if value.get("id") != object_id):
            return "ID already exists", 409
        data["id"] = new_id

    Database.data[category][index].update(data)
    if new_id is not None and new_id != object_id:
        reference_fields = {
            "buildings": ("building",),
            "areas": ("area",),
            "tags": ("tags",),
        }
        for values in Database.data.values():
            for value in values:
                for field in reference_fields.get(category, ()):
                    if field == "tags" and isinstance(value.get(field), list):
                        value[field] = [new_id if tag_id == object_id else tag_id for tag_id in value[field]]
                    elif value.get(field) == object_id:
                        value[field] = new_id
    Database.save()
    return "OK", 200


@app.route("/api/delete", methods=["POST"])
def delete():
    opts = request.json
    object_id = opts["objectId"]
    category = opts["category"]
    index = -1
    for i, v in enumerate(Database.data[category]):
        if v["id"] == object_id:
            index = i
    if index == -1:
        return "Not found", 404
    Database.data[category].pop(index)
    Database.save()
    return "OK", 200


if __name__ == "__main__":
    Database.init()
    app.run(debug=True, host="0.0.0.0", port=5001)
