from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- añade esto
from app.routes import part_routes

app = FastAPI()

# 🔧 Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 Cargar rutas
app.include_router(part_routes.router)
