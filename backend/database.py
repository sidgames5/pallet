import json
import os


class Database:
    data = {}

    @staticmethod
    def init():
        if os.path.exists(".run/main.db"):
            with open(".run/main.db", "r", encoding="utf-8") as f:
                Database.data = json.loads(f.read())
            return
        os.mkdir(".run")
        Database.data = {"buildings": [], "areas": [], "shelves": [], "items": []}
        with open(".run/main.db", "w", encoding="utf-8") as f:
            f.write(json.dumps(Database.data))
            f.close()

    @staticmethod
    def save():
        with open(".run/main.db", "w", encoding="utf-8") as f:
            f.write(json.dumps(Database.data))
            f.close()
