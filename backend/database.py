import json
import os


class Database:
    data = {}

    @staticmethod
    def init():
        if os.path.exists(".run/main.db"):
            with open(".run/main.db", "r", encoding="utf-8") as f:
                Database.data = json.loads(f.read())
        else:
            if not os.path.exists(".run"):
                os.mkdir(".run")
            Database.data = {"buildings": [], "areas": [], "items": [], "tags": []}

        Database.data.pop("shelves", None)
        for category in ("buildings", "areas", "items", "tags"):
            for value in Database.data.setdefault(category, []):
                if "id" in value:
                    value["id"] = str(value["id"])
                if category == "items" and value.get("stock") == -1:
                    value.pop("stock")
                for field in ("building", "area"):
                    if field in value and value[field] is not None:
                        value[field] = str(value[field])
                if "slot" in value and value["slot"] is not None:
                    value["slot"] = str(value["slot"])
                if "reorderLink" in value and value["reorderLink"] is not None:
                    value["reorderLink"] = str(value["reorderLink"])
                if isinstance(value.get("tags"), list):
                    value["tags"] = [str(tag_id) for tag_id in value["tags"]]
                value.pop("shelf", None)

        Database.save()

    @staticmethod
    def save():
        with open(".run/main.db", "w", encoding="utf-8") as f:
            f.write(json.dumps(Database.data))
            f.close()
