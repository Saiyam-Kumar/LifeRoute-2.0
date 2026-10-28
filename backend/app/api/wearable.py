
from datetime import datetime, timezone

from fastapi import APIRouter, Header, HTTPException

from app.core.config import settings
from app.models.wearable import WearableVitalsCreate
from app.services.vitals_service import VitalsService


router = APIRouter(
    prefix="/wearable",
    tags=["Wearable"],
)

vitals_service = VitalsService()


@router.post("/vitals")
def receive_wearable_vitals(
    reading: WearableVitalsCreate,
    x_device_id: str | None = Header(default=None),
    x_device_key: str | None = Header(default=None),
):
    if x_device_id != settings.WEARABLE_DEVICE_ID:
        raise HTTPException(
            status_code=401,
            detail="Invalid wearable device.",
        )

    if x_device_key != settings.WEARABLE_DEVICE_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid wearable device credentials.",
        )

    data = reading.model_dump(exclude_none=True)

    data["patient_id"] = settings.WEARABLE_PATIENT_ID
    data["device_id"] = settings.WEARABLE_DEVICE_ID
    data["timestamp"] = datetime.now(timezone.utc)

    result = vitals_service.process_wearable_reading(data)

    return {
        "success": True,
        "message": "Wearable vitals received.",
        "live": result,
    }
