# app/schemas/part_schema.py

from pydantic import BaseModel
from typing import Optional

# Modelo para crear una nueva parte (entrada)
class PartCreate(BaseModel):
    name: str
    brand: str
    price: float
    stock: int
    description: Optional[str] = None

# Modelo para respuesta al frontend (incluye ID)
class PartResponse(PartCreate):
    id: str
