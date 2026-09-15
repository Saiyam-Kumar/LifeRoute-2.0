from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool
    HOST: str
    PORT: int

    ORS_API_KEY: str

    # Wearable configuration
    WEARABLE_DEVICE_ID: str
    WEARABLE_DEVICE_KEY: str
    WEARABLE_PATIENT_ID: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()