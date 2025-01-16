import json
import os

class Database:
    @staticmethod
    def init():
        if os.path.exists(".run/main.db"):
            return
        os.mkdir(".run")
        with open(".run/main.db", "w", encoding="utf-8") as f:
            f.write(json.dumps({
                "buildings": [],
                "areas": [],
                "shelves": [],
                "items": []
            }))
            f.close()
