from fastapi import APIRouter, HTTPException
from app.models.part_model import Part
from app.crud import part_crud

router = APIRouter()

@router.get("/parts")
def list_parts():
    parts = part_crud.get_all_parts()
    for part in parts:
        part["_id"] = str(part["_id"])
    return parts
@router.get("/parts/{part_id}")
def get_part(part_id: str):
    part = part_crud.get_part_by_custom_id(part_id)
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    part["_id"] = str(part["_id"])

    if part.get("stock", 0) == 0:
        part["status"] = "Out of stock"

    return part


@router.post("/parts")
def create_part(part: Part):
    try:
        result = part_crud.create_part(part.dict())
        return {"inserted_id": str(result.inserted_id)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/parts/{id}")
def update_part(id: str, part: Part):
    try:
        result = part_crud.update_part_by_custom_id(id, part.dict())
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Part not found or data unchanged")
        return {"message": "Part updated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/parts/{part_id}")
def delete_part(part_id: str):
    result = part_crud.delete_part_by_custom_id(part_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": f"Part with id '{part_id}' deleted"}

@router.put("/parts/mongo/{id}")
def update_part_by_mongo_id(id: str, part: Part):
    result = part_crud.update_part_by_id(id, part.dict())
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": "Part updated successfully"}

@router.delete("/parts/mongo/{id}")
def delete_part_by_mongo_id(id: str):
    result = part_crud.delete_part_by_id(id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Part not found")
    return {"message": f"Part with Mongo _id '{id}' deleted"}