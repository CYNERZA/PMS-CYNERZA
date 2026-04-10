"""
Application configuration using Pydantic Settings.
Loads configuration from environment variables and .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./hotel_pms.db"
    
    # JWT Configuration
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PUBLIC_SIGNUP_ENABLED: bool = True
    
    # Admin User
    BOOTSTRAP_ADMIN_ON_STARTUP: bool = False
    ADMIN_EMAIL: str = "admin@hotel.com"
    ADMIN_PASSWORD: str = "admin123"
    
    # Inventory
    INVENTORY_DAYS_AHEAD: int = 90
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
