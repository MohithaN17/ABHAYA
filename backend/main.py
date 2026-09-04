from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.database import Base, engine
from backend.app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"project": settings.PROJECT_NAME, "status": "running"}