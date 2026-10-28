from fastapi import APIRouter, Depends, HTTPException
from app.models.emergency import EmergencyStatusUpdate

from app.core.auth import verify_firebase_token
from app.services.emergency_service import EmergencyService
from app.services.hospital_service import HospitalService


router = APIRouter(prefix="/emergency", tags=["Emergency"])

service = EmergencyService()
hospital_service = HospitalService()


@router.post("/cases")
def create_emergency_case(
    data: dict,
    decoded_token: dict = Depends(verify_firebase_token),
):
    uid = decoded_token.get("uid")

    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user UID not found.",
        )

    patient_data = data.get("patient_data")
    prediction = data.get("prediction")

    if not patient_data:
        raise HTTPException(
            status_code=400,
            detail="patient_data is required.",
        )

    if not prediction:
        raise HTTPException(
            status_code=400,
            detail="prediction is required.",
        )

    try:
        case = service.create_emergency_case(
            patient_id=uid,
            patient_data=patient_data,
            prediction=prediction,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    if case is None:
        raise HTTPException(
            status_code=400,
            detail="No recommended hospital was found.",
        )

    return {
        "message": "Emergency case created successfully.",
        "case": case,
    }


@router.get("/hospital/{hospital_id}")
def get_hospital_emergencies(
    hospital_id: str,
    decoded_token: dict = Depends(verify_firebase_token),
):
    uid = decoded_token.get("uid")

    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user UID not found.",
        )

    hospital = hospital_service.get_hospital_by_firebase_uid(uid)

    if not hospital:
        raise HTTPException(
            status_code=403,
            detail="Hospital account is not registered.",
        )

    if hospital.get("id") != hospital_id:
        raise HTTPException(
            status_code=403,
            detail="You can only view emergencies assigned to your hospital.",
        )

    emergencies = service.get_hospital_emergencies(hospital_id)

    return {
        "hospital_id": hospital_id,
        "emergencies": emergencies,
    }

@router.patch("/cases/{case_id}/status")
def update_emergency_status(
    case_id: str,
    data: EmergencyStatusUpdate,
    decoded_token: dict = Depends(verify_firebase_token),
):
    uid = decoded_token.get("uid")

    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user UID not found.",
        )

    hospital = hospital_service.get_hospital_by_firebase_uid(uid)

    if not hospital:
        raise HTTPException(
            status_code=403,
            detail="Hospital account is not registered.",
        )

    hospital_id = hospital.get("id")

    try:
        emergency = service.update_emergency_status(
            case_id=case_id,
            hospital_id=hospital_id,
            new_status=data.status,
        )

    except PermissionError as error:
        raise HTTPException(
            status_code=403,
            detail=str(error),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    return {
        "message": "Emergency status updated successfully.",
        "case": emergency,
    }

@router.get("/my-case")
def get_my_emergency_case(
    decoded_token: dict = Depends(verify_firebase_token),
):
    uid = decoded_token.get("uid")

    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user UID not found.",
        )

    emergency = service.get_patient_emergency(uid)

    if emergency is None:
        raise HTTPException(
            status_code=404,
            detail="No emergency case found for this patient.",
        )

    return {
        "case": emergency,
    }