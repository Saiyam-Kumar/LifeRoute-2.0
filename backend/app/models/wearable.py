from pydantic import BaseModel, Field


class WearableVitalsCreate(BaseModel):
    heart_rate: float | None = Field(default=None, ge=0, le=250)
    spo2: float | None = Field(default=None, ge=0, le=100)
    temperature: float | None = Field(default=None, ge=20, le=50)
    activity: float | None = Field(default=None, ge=0)