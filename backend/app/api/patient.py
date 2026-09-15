from fastapi import APIRouter, Depends

from app.core.auth import verify_firebase_token
from app.services.patient_service import PatientService


router = APIRouter(
    prefix="/patient",
    tags=["Patient"],
)

patient_service = PatientService()


@router.post("/register")
def register_patient(
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Create/link the authenticated Firebase user
    to a LifeRoute patient record.
    """

    uid = decoded_token["uid"]
    email = decoded_token.get("email")

    if not email:
        return {
            "message": "Firebase account does not contain an email."
        }

    patient = patient_service.create_patient(
        uid=uid,
        email=email,
    )

    return {
        "message": "Patient registered successfully",
        "patient": patient,
    }


@router.get("/me")
def get_current_patient(
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Return the LifeRoute patient associated with
    the authenticated Firebase user.
    """

    uid = decoded_token["uid"]

    patient = patient_service.get_patient(uid)

    if patient is None:
        return {
            "uid": uid,
            "email": decoded_token.get("email"),
            "registered": False,
            "message": "This account is not registered as a patient.",
        }

    return {
        "registered": True,
        "patient": patient,
    }


@router.put("/profile")
def update_patient_profile(
    profile_data: dict,
    decoded_token: dict = Depends(verify_firebase_token),
):
    """
    Update the profile information of the
    authenticated patient.
    """

    uid = decoded_token["uid"]

    updated_patient = patient_service.update_patient(
        uid=uid,
        update_data=profile_data,
    )

    if updated_patient is None:
        return {
            "message": "Patient profile not found.",
        }

    return {
        "message": "Patient profile updated successfully.",
        "patient": updated_patient,
    }