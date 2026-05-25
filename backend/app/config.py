import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Student Details Registry"
    API_V1_STR: str = "/api/v1"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database Settings
    SQLITE_DB_FILE: str = "student_registry.db"
    
    @property
    def DATABASE_URL(self) -> str:
        # SQLite URL format
        return f"sqlite:///{self.SQLITE_DB_FILE}"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
