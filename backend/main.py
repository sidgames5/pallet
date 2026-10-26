from flask import Flask, jsonify, request

from backend.database import Database

app = Flask(__name__)


@app.route("/api/read")
def read():
    return jsonify(Database.data)


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
