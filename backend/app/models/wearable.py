from pydantic import BaseModel, Field


class WearableVitalsCreate(BaseModel):
    heart_rate: float | None = None
    spo2: float | None = None
    activity: float | None = None

    # ESP32 sends temperature in Fahrenheit.
    temperature: float | None = Field(
        default=None,
        description="Temperature in degrees Fahrenheit",
    )
