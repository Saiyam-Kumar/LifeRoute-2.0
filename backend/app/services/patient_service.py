from app.database.firebase import db


class PatientService:
    """
    Handles Firestore operations for LifeRoute patients.
    """

    COLLECTION = "patients"

    def get_patient(self, uid: str):
        doc = (
            db.collection(self.COLLECTION)
            .document(uid)
            .get()
        )

        if not doc.exists:
            return None

        patient = doc.to_dict()
        patient["uid"] = doc.id

        return patient

    def create_patient(
        self,
        uid: str,
        email: str
    ):
        doc_ref = (
            db.collection(self.COLLECTION)
            .document(uid)
        )

        existing_doc = doc_ref.get()

        if existing_doc.exists:
            patient = existing_doc.to_dict()
            patient["uid"] = uid

            return patient

        patient_data = {
            "uid": uid,
            "email": email,
        }

        doc_ref.set(patient_data)

        return patient_data