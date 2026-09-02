from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ABHAYA Backend Service"
    API_V1_STR: str = "/api/v1"

    # Supabase Credentials
    SUPABASE_URL: str = Field(default="https://your-supabase-project.supabase.co")
    SUPABASE_PUBLISHABLE_KEY: str = Field(default="sbp_placeholder")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="service_role_placeholder")
    SUPABASE_JWT_SECRET: str = Field(default="supersecretjwtkey12345_supabase_secret_key_32bytes")

    # Supabase PostgreSQL Connection String
    DATABASE_URL: str = Field(
        default="postgresql://postgres:password@localhost:5432/postgres"
    )

    # Security & CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:3000,http://localhost:3005,http://localhost:5173"
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def supabase_base_url(self) -> str:
        url = self.SUPABASE_URL.strip().rstrip("/")
        if url.endswith("/rest/v1"):
            url = url[:-8].rstrip("/")
        return url

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return ["*"]


settings = Settings()
