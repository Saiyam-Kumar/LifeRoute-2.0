from datetime import datetime

from pydantic import BaseModel, Field


class VitalReadingCreate(BaseModel):
    patient_id: str = Field(min_length=1)
    device_id: str = Field(min_length=1)

    timestamp: datetime | None = None

    heart_rate: float | None = Field(default=None, ge=0, le=250)
    spo2: float | None = Field(default=None, ge=0, le=100)
    temperature: float | None = Field(default=None, ge=20, le=50)
    activity: float | None = Field(default=None, ge=0)


class VitalReadingResponse(VitalReadingCreate):
    id: str
    recorded_at: datetime
