"""Configuration management for AI service - Simplified"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    
    # AI APIs (Optional)
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_TOKEN: str = ""
    
    # Redis Cache (Disabled by default)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_ENABLED: bool = False
    
    # Model Paths
    MODEL_DIR:str = "./models"
    DATA_DIR: str = "./data"
    
    # Monitoring
    LOG_LEVEL: str = "INFO"
    METRICS_ENABLED: bool = True
    
    # Security
    SECRET_KEY: str = "development-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )


settings = Settings()
