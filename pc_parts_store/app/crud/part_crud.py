from app.database.connection import db
from bson import ObjectId
from app.database.connection import db

def get_all_parts():
    return list(db.parts.find())

def get_part_by_object_id(part_id):
    return db.parts.find_one({"_id": ObjectId(part_id)})

def get_part_by_custom_id(part_id):
    return db.parts.find_one({"id": part_id})

def create_part(part_data):
    existing = db.parts.find_one({"id": part_data["id"]})
    if existing:
        raise ValueError("A part with this ID already exists")  # Este error lo captura el router
    if part_data["stock"] < 0:
        raise ValueError("Stock cannot be negative")
    return db.parts.insert_one(part_data)


def update_part_by_custom_id(part_id, update_data):
    if "stock" in update_data and update_data["stock"] < 0:
        raise ValueError("Stock cannot be negative")

    return db.parts.update_one(
        {"id": part_id},
        {"$set": update_data}
    )


def delete_part_by_custom_id(part_id):
    return db.parts.delete_one({"id": part_id})


def update_part_by_id(part_id, part_data):
    return db.parts.update_one({"_id": ObjectId(part_id)}, {"$set": part_data})

def delete_part_by_id(part_id):
    return db.parts.delete_one({"_id": ObjectId(part_id)})
