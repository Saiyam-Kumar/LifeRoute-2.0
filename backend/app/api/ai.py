from fastapi import APIRouter, Depends

from app.models.patient_input import PatientInput
from app.services.recommendation import RecommendationService
from app.core.auth import verify_firebase_token

from ai.predictor import predict_ktas
from ai.resource_engine.resource_predictor import predict_resources


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


recommendation_service = RecommendationService()


@router.post("/predict")
def predict(
    patient: PatientInput,
    decoded_token: dict = Depends(
        verify_firebase_token
    ),
):

    # --------------------------------------------------
    # Authenticated patient
    # --------------------------------------------------

    uid = decoded_token.get("uid")

    if not uid:
        return {
            "error":
                "Authenticated user UID not found."
        }


    # --------------------------------------------------
    # Patient input
    # --------------------------------------------------

    patient_data = patient.model_dump()


    # --------------------------------------------------
    # Step 1: KTAS Prediction
    # --------------------------------------------------

    ktas_level = predict_ktas(
        patient_data
    )

    patient_data["ktas"] = ktas_level


    # --------------------------------------------------
    # Step 2: Resource Allocation
    # --------------------------------------------------

    resource_result = predict_resources(
        patient_data
    )

    resources = resource_result["resources"]


    # --------------------------------------------------
    # Step 3: Hospital Recommendation
    # --------------------------------------------------

    patient_location = (
        patient.latitude,
        patient.longitude
    )

    hospital_result = (
        recommendation_service.recommend_hospital(
            patient_location=patient_location,
            patient_resources=resources
        )
    )


    # --------------------------------------------------
    # Final response
    # --------------------------------------------------

    return {
        "ktas_level": ktas_level,
        "category":
            resource_result["category"],
        "resources": resources,
        "reasons":
            resource_result["reasons"],
        "recommended_hospital":
            hospital_result
    }