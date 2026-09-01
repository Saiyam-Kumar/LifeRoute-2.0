from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.auth import verify_firebase_token
from app.models.vital import VitalReadingCreate
from app.services.vitals_service import VitalsService


router = APIRouter(
    prefix="/vitals",
    tags=["Vitals"],
)

vitals_service = VitalsService()


@router.post("/")
def create_vital_reading(
    reading: VitalReadingCreate,
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Store a health/vital reading for an authenticated patient.
    """

    uid = decoded_token["uid"]

    if reading.patient_id != uid:
        raise HTTPException(
            status_code=403,
            detail="You can only submit vitals for your own patient account.",
        )

    data = reading.model_dump(exclude_none=True)

    return vitals_service.create_reading(data)


@router.get("/latest/{patient_id}")
def get_latest_vitals(
    patient_id: str,
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Return the latest health reading for a patient.
    """

    uid = decoded_token["uid"]

    if patient_id != uid:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own health data.",
        )

    reading = vitals_service.get_latest(patient_id)

    if reading is None:
        raise HTTPException(
            status_code=404,
            detail="No health readings found.",
        )

    return reading


@router.get("/history/{patient_id}")
def get_vital_history(
    patient_id: str,
    limit: int = Query(default=100, ge=1, le=500),
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Return historical health readings for a patient.
    """

    uid = decoded_token["uid"]

    if patient_id != uid:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own health data.",
        )

    return vitals_service.get_history(
        patient_id=patient_id,
        limit=limit,
    )
