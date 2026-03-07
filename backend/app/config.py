from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Obelisk Mission Control"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://obelisk:obelisk@postgres:5432/obelisk"
    redis_url: str = "redis://redis:6379/0"
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", env_prefix="OBELISK_")


settings = Settings()
