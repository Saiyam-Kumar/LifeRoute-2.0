from datetime import datetime, timezone

from app.database.firebase import db


class VitalsService:
    COLLECTION = "health_readings"

    def create_reading(self, data: dict):
        doc_ref = db.collection(self.COLLECTION).document()

        recorded_at = datetime.now(timezone.utc)

        reading = {
            **data,
            "recorded_at": recorded_at,
        }

        doc_ref.set(reading)

        reading["id"] = doc_ref.id

        return reading

    def get_latest(self, patient_id: str):
        # Fetch the patient's readings without requiring
        # a composite Firestore index.
        docs = (
            db.collection(self.COLLECTION)
            .where("patient_id", "==", patient_id)
            .stream()
        )

        latest_reading = None
        latest_time = None

        for doc in docs:
            reading = doc.to_dict()
            recorded_at = reading.get("recorded_at")

            if recorded_at is None:
                continue

            # Firestore timestamps normally come back as datetime objects.
            if isinstance(recorded_at, datetime):
                current_time = recorded_at
            else:
                continue

            if latest_time is None or current_time > latest_time:
                latest_time = current_time
                reading["id"] = doc.id
                latest_reading = reading

        return latest_reading

    def get_history(self, patient_id: str, limit: int = 100):
        # Same approach: avoid requiring the composite index.
        docs = (
            db.collection(self.COLLECTION)
            .where("patient_id", "==", patient_id)
            .stream()
        )

        readings = []

        for doc in docs:
            reading = doc.to_dict()
            reading["id"] = doc.id
            readings.append(reading)

        # Sort newest first in Python.
        readings.sort(
            key=lambda x: x.get("recorded_at", datetime.min),
            reverse=True,
        )

        return readings[:limit]