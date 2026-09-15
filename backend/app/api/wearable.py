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
    """
    Receive vital readings from an authenticated LifeRoute wearable.
    """

    # Verify wearable identity
    if x_device_id != settings.WEARABLE_DEVICE_ID:
        raise HTTPException(
            status_code=401,
            detail="Invalid wearable device.",
        )

    # Verify wearable secret key
    if x_device_key != settings.WEARABLE_DEVICE_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid wearable device credentials.",
        )

    # Convert wearable data into the existing health_readings format
    data = reading.model_dump(exclude_none=True)

    # Backend determines patient and device
    data["patient_id"] = settings.WEARABLE_PATIENT_ID
    data["device_id"] = settings.WEARABLE_DEVICE_ID

    # Add timestamp if wearable did not provide one
    data["timestamp"] = datetime.now(timezone.utc)

    # Reuse existing vitals storage
    return vitals_service.create_reading(data)