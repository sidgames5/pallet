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
    search_by = options.get("searchBy", "id")

    if not isinstance(csv_text, str) or not csv_text.strip():
        return "CSV data is required", 400
    if not isinstance(id_column, str) or not isinstance(quantity_column, str):
        return "Item and quantity columns are required", 400
    if search_by not in ("id", "name"):
        return "Search field must be ID or name", 400

    try:
        csv_text = csv_text.lstrip("\ufeff")
        first_line = next((line for line in csv_text.splitlines() if line.strip()), "")
        delimiter = "\t" if "\t" in first_line else ","
        csv_stream = io.StringIO(csv_text)
        while True:
            header_position = csv_stream.tell()
            header_line = csv_stream.readline()
            if not header_line:
                break
            if header_line.strip():
                csv_stream.seek(header_position)
                break
        rows = csv.DictReader(csv_stream, delimiter=delimiter)
        if not rows.fieldnames:
            return "CSV header is required", 400
        normalize_field = lambda field: field.strip().lstrip("\ufeff") if field is not None else ""
        normalized_fields = {normalize_field(field): field for field in rows.fieldnames if field is not None}
        normalized_id_column = normalize_field(id_column)
        normalized_quantity_column = normalize_field(quantity_column)
        if normalized_id_column not in normalized_fields or normalized_quantity_column not in normalized_fields:
            return "Selected columns were not found in the CSV header", 400
        id_field = normalized_fields[normalized_id_column]
        quantity_field = normalized_fields[normalized_quantity_column]

        requirements = {}
        for line_number, row in enumerate(rows, start=2):
            item_id = (row.get(id_field) or "").strip()
            raw_quantity = (row.get(quantity_field) or "").strip()
            if not item_id or not raw_quantity:
                continue
            try:
                quantity = float(raw_quantity)
            except ValueError:
                return f"Invalid quantity on row {line_number}", 400
            if quantity <= 0 or not quantity.is_integer():
                return f"Quantity on row {line_number} must be a positive whole number", 400
            requirements[item_id] = requirements.get(item_id, 0) + int(quantity)
    except csv.Error as error:
        return f"Invalid CSV: {error}", 400

    inventory = {
        str(item.get(search_by)): item
        for item in Database.data.get("items", [])
        if item.get(search_by) is not None
    }
    restock = []
    for item_id, required in requirements.items():
        item = inventory.get(item_id)
        stock = item.get("stock") if item else 0
        stock = stock if isinstance(stock, (int, float)) and stock >= 0 else 0
        if required > stock:
            restock.append({
                "id": str(item.get("id")) if item else item_id,
                "name": item.get("name", "Unknown item") if item else "Item not found",
                "reorderLink": item.get("reorderLink") if item else None,
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
    if key == "items" and data.get("slot") is not None:
        data["slot"] = str(data["slot"])
    if key == "items" and data.get("reorderLink") is not None:
        data["reorderLink"] = str(data["reorderLink"])
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
    if category == "items" and data.get("slot") is not None:
        data["slot"] = str(data["slot"])
    if category == "items" and data.get("reorderLink") is not None:
        data["reorderLink"] = str(data["reorderLink"])

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
