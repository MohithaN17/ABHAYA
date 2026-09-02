from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.auth import router as auth_router
from app.api.v1.cases import router as cases_router
from app.api.v1.distress import router as distress_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router

# Initialize database schema tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ABHAYA SIH26094 FastAPI Backend with Supabase PostgreSQL and Supabase Auth",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(cases_router, prefix=settings.API_V1_STR)
app.include_router(distress_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "auth_provider": "Supabase Auth",
        "database": "Supabase PostgreSQL",
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }
