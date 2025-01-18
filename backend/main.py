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
    if key in Database.data:
        last_id = 0
        if len(Database.data[key]) > 0:
            last_id = Database.data[key][-1]["id"]
        data["id"] = last_id + 1
        Database.data[key].append(data)
        Database.save()
        return "OK", 200
    else:
        Database.data[key] = [data]
        Database.save()
        return "Created", 201


@app.route("/api/edit", methods=["POST"])
def edit():
    opts = request.json
    category = request.category
    objectId = request.objectId
    data = request.data


if __name__ == "__main__":
    Database.init()
    app.run(debug=True, host="0.0.0.0")
