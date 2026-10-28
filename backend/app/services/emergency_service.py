from datetime import datetime, timezone

from app.database.firebase import db
from app.services.recommendation import RecommendationService
from app.services.patient_service import PatientService
from app.services.sms_service import sms_service


class EmergencyService:
    COLLECTION = "emergencies"

    def __init__(self):
        self.recommendation = RecommendationService()
        self.patient_service = PatientService()

    def create_emergency_case(
        self,
        patient_id: str,
        patient_data: dict,
        prediction: dict,
    ):
        recommended_hospital = prediction.get("recommended_hospital")

        if not recommended_hospital:
            return None

        hospital_id = recommended_hospital.get("id")

        if not hospital_id:
            raise ValueError("Recommended hospital ID is missing.")

        ktas_level = prediction.get("ktas_level")

        case_data = {
            "patient_id": patient_id,
            "hospital_id": hospital_id,
            "status": "incoming",

            "patient": {
                "age": patient_data.get("age"),
                "gender": patient_data.get("sex"),
                "chief_complaint": patient_data.get("chief_complain"),
                "mental": patient_data.get("mental"),
                "pain": patient_data.get("pain"),
                "nrs_pain": patient_data.get("nrs_pain"),
                "injury": patient_data.get("injury"),
            },

            "vitals": {
                "heart_rate": patient_data.get("hr"),
                "spo2": patient_data.get("saturation"),
                "systolic_bp": patient_data.get("sbp"),
                "diastolic_bp": patient_data.get("dbp"),
                "respiratory_rate": patient_data.get("rr"),
            },

            "location": {
                "latitude": patient_data.get("latitude"),
                "longitude": patient_data.get("longitude"),
            },

            "assessment": {
                "ktas_level": ktas_level,
                "category": prediction.get("category"),
                "resources": prediction.get("resources", []),
                "reasons": prediction.get("reasons", []),
            },

            "hospital": {
                "name": recommended_hospital.get("hospital"),
                "score": recommended_hospital.get("score"),
                "eta": recommended_hospital.get("eta"),
                "distance_km": recommended_hospital.get("distance_km"),
                "matched_resources": recommended_hospital.get(
                    "matched_resources", []
                ),
                "missing_resources": recommended_hospital.get(
                    "missing_resources", []
                ),
            },

            "created_at": datetime.now(timezone.utc),
        }

        # Create the emergency case first.
        # SMS failure must never stop the hospital from receiving the case.
        doc_ref = db.collection(self.COLLECTION).document()
        doc_ref.set(case_data)

        case_data["id"] = doc_ref.id

        # --------------------------------------------------
        # EMERGENCY CONTACT SMS
        # KTAS 1, 2, 3 -> send SMS
        # --------------------------------------------------

        if ktas_level in [1, 2, 3]:

            try:
                patient = self.patient_service.get_patient(patient_id)

                if patient:
                    emergency_contact_phone = patient.get(
                        "emergency_contact_phone"
                    )

                    emergency_contact_name = patient.get(
                        "emergency_contact_name"
                    ) or "Emergency Contact"

                    patient_name = patient.get(
                        "full_name"
                    ) or "LifeRoute Patient"

                    if emergency_contact_phone:

                        sms_result = sms_service.send_emergency_alert(
                            to_phone=emergency_contact_phone,
                            patient_name=patient_name,
                            ktas_level=int(ktas_level),
                        )

                        notification = {
                            "sms_sent": True,
                            "recipient_name": emergency_contact_name,
                            "message_sid": sms_result.get("message_sid"),
                        }

                    else:
                        notification = {
                            "sms_sent": False,
                            "reason": "Emergency contact phone number is missing.",
                        }

                else:
                    notification = {
                        "sms_sent": False,
                        "reason": "Patient profile not found.",
                    }

            except Exception as error:
                print("Emergency SMS failed:", error)

                notification = {
                    "sms_sent": False,
                    "reason": "SMS service failed.",
                }

            # Store notification result in the emergency case
            db.collection(self.COLLECTION).document(
                case_data["id"]
            ).update({
                "notification": notification
            })

            case_data["notification"] = notification

        return case_data

    def get_hospital_emergencies(self, hospital_id: str):
        docs = (
            db.collection(self.COLLECTION)
            .where("hospital_id", "==", hospital_id)
            .stream()
        )

        emergencies = []

        for doc in docs:
            emergency = doc.to_dict()
            emergency["id"] = doc.id
            emergencies.append(emergency)

        emergencies.sort(
            key=lambda emergency: emergency.get(
                "created_at",
                datetime.min.replace(tzinfo=timezone.utc),
            ),
            reverse=True,
        )

        return emergencies

    def update_emergency_status(
        self,
        case_id: str,
        hospital_id: str,
        new_status: str,
    ):
        doc_ref = db.collection(self.COLLECTION).document(case_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise ValueError("Emergency case not found.")

        emergency = doc.to_dict()

        if emergency.get("hospital_id") != hospital_id:
            raise PermissionError(
                "You can only update emergencies assigned to your hospital."
            )

        current_status = emergency.get("status", "incoming")

        allowed_transitions = {
            "incoming": {"accepted"},
            "accepted": {"preparing"},
            "preparing": {"patient_arrived"},
            "patient_arrived": {"completed"},
            "completed": set(),
        }

        if new_status not in allowed_transitions.get(current_status, set()):
            raise ValueError(
                f"Invalid status transition: "
                f"{current_status} -> {new_status}"
            )

        update_data = {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc),
        }

        doc_ref.update(update_data)

        emergency.update(update_data)
        emergency["id"] = case_id

        return emergency

    def get_patient_emergency(self, patient_id: str):
        docs = (
            db.collection(self.COLLECTION)
            .where("patient_id", "==", patient_id)
            .stream()
        )

        emergencies = []

        for doc in docs:
            emergency = doc.to_dict()
            emergency["id"] = doc.id
            emergencies.append(emergency)

        if not emergencies:
            return None

        emergencies.sort(
            key=lambda emergency: emergency.get(
                "created_at",
                datetime.min.replace(tzinfo=timezone.utc),
            ),
            reverse=True,
        )

        return emergencies[0]