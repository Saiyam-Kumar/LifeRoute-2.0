from app.database.firebase import db


class PatientService:
    COLLECTION = "patients"

    def get_patient(self, uid: str):
        doc = db.collection(self.COLLECTION).document(uid).get()

        if not doc.exists:
            return None

        patient = doc.to_dict()
        patient["uid"] = doc.id
        return patient

    def create_patient(self, uid: str, email: str):
        doc_ref = db.collection(self.COLLECTION).document(uid)
        existing_doc = doc_ref.get()

        if existing_doc.exists:
            patient = existing_doc.to_dict()
            patient["uid"] = uid
            return patient

        patient_data = {
            "uid": uid,
            "email": email,

            # Profile information
            "full_name": "",
            "date_of_birth": "",
            "gender": "",
            "phone": "",
            "address": "",
            "blood_group": "",

            # Medical information
            "medical_conditions": [],
            "medical_history": "",
            "allergies": [],
            "current_medications": [],

            # Emergency contact
            "emergency_contact_name": "",
            "emergency_contact_phone": "",
            "emergency_contact_relationship": "",
        }

        doc_ref.set(patient_data)
        return patient_data

    def update_patient(self, uid: str, update_data: dict):
        doc_ref = db.collection(self.COLLECTION).document(uid)

        if not doc_ref.get().exists:
            return None

        # Fields that the patient is allowed to edit
        allowed_fields = {
            "full_name",
            "date_of_birth",
            "gender",
            "phone",
            "address",
            "blood_group",
            "medical_conditions",
            "medical_history",
            "allergies",
            "current_medications",
            "emergency_contact_name",
            "emergency_contact_phone",
            "emergency_contact_relationship",
        }

        cleaned_data = {
            key: value
            for key, value in update_data.items()
            if key in allowed_fields
        }

        if cleaned_data:
            doc_ref.update(cleaned_data)

        updated = doc_ref.get().to_dict()
        updated["uid"] = uid

        return updated