# app/models/part_model.py
from pydantic import BaseModel, Field, validator
from typing import Optional

class Part(BaseModel):
    id: str  # Custom ID (e.g., "P001")
    name: str
    brand: str
    price: float = Field(..., ge=0, description="Price must be zero or positive")
    stock: int = Field(..., ge=0, description="Stock must be zero or positive")
    description: Optional[str] = None

    @validator("stock")
    def validate_stock(cls, value):
        if value < 0:
            raise ValueError("Stock cannot be negative")
        return value

    @validator("price")
    def validate_price(cls, value):
        if value < 0:
            raise ValueError("Price cannot be negative")
        return value
