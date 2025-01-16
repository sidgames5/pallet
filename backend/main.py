from flask import Flask, jsonify, request

from backend.database import Database

app = Flask(__name__)


@app.route("/api/read")
def read():
    return jsonify(Database.data)


@app.route("/api/write", methods=["POST"])
def write():
    opts = request.json
    key = None
    data = None
    try:
        key = opts["key"]
        data = opts["data"]
    except AttributeError:
        pass
    if key is None or data is None:
        return "Bad request", 400
    if key in Database.data:
        Database.data[key].append(data)
        Database.save()
        return "OK", 200
    else:
        Database.data[key] = [data]
        Database.save()
        return "Created", 201


if __name__ == "__main__":
    Database.init()
    app.run(debug=True, host="0.0.0.0")
