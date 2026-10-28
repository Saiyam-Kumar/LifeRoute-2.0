from datetime import datetime, timezone
from typing import Any

# LifeRoute 2.0 - vital monitoring service
class VitalsService:
    COLLECTION = "health_readings"

    # ---------------------------------------------------------
    # LIVE WEARABLE CACHE
    #
    # IMPORTANT:
    # This is RAM, NOT Firestore.
    #
    # ESP32 can send every few seconds without causing a
    # Firestore write for every reading.
    # ---------------------------------------------------------

    _live_wearable_cache: dict[str, dict[str, Any]] = {}

    # Historical wearable reading interval
    HISTORY_INTERVAL_SECONDS = 5 * 60

    # ---------------------------------------------------------
    # EXISTING NORMAL VITALS
    # ---------------------------------------------------------

    def create_reading(self, data: dict):
        """
        Existing historical vitals behavior.

        Creates a new Firestore document.

        This method is intentionally preserved so existing
        patient/manual vitals functionality is not changed.
        """

        from app.database.firebase import db

        doc_ref = db.collection(self.COLLECTION).document()

        recorded_at = datetime.now(timezone.utc)

        reading = {
            **data,
            "recorded_at": recorded_at,
        }

        doc_ref.set(reading)

        reading["id"] = doc_ref.id

        return reading

    # ---------------------------------------------------------
    # WEARABLE READING
    # ---------------------------------------------------------

    def process_wearable_reading(self, data: dict):
        """
        Process an incoming ESP32 reading.

        LIVE:
            Stored in server RAM.

        HISTORY:
            Stored in Firestore only once every 5 minutes.

        This means an ESP32 sending every 3 seconds does NOT
        generate a Firestore write every 3 seconds.
        """

        device_id = data.get("device_id")

        if not device_id:
            raise ValueError(
                "Wearable device_id is required."
            )

        now = datetime.now(timezone.utc)

        # -----------------------------------------------------
        # GET EXISTING CACHE ENTRY
        # -----------------------------------------------------

        previous = self._live_wearable_cache.get(
            device_id
        )

        last_history_saved_at = None

        if previous:
            last_history_saved_at = previous.get(
                "last_history_saved_at"
            )

        # -----------------------------------------------------
        # UPDATE LIVE RAM CACHE
        # -----------------------------------------------------

        live_reading = {
            **data,
            "updated_at": now,
            "id": device_id,
        }

        # Preserve history timing information internally.
        if last_history_saved_at is not None:
            live_reading["last_history_saved_at"] = (
                last_history_saved_at
            )

        self._live_wearable_cache[device_id] = (
            live_reading
        )

        # -----------------------------------------------------
        # DETERMINE WHETHER HISTORY SHOULD BE SAVED
        # -----------------------------------------------------

        should_save_history = False

        if last_history_saved_at is None:
            # First reading gets saved immediately.
            should_save_history = True

        else:
            elapsed_seconds = (
                now - last_history_saved_at
            ).total_seconds()

            if (
                elapsed_seconds
                >= self.HISTORY_INTERVAL_SECONDS
            ):
                should_save_history = True

        history_saved = False

        # -----------------------------------------------------
        # SAVE HISTORY ONLY EVERY 5 MINUTES
        # -----------------------------------------------------

        if should_save_history:

            history_data = {
                **data,
                "recorded_at": now,
            }

            history_result = self.create_reading(
                history_data
            )

            history_saved = True

            # Update RAM with latest history timestamp.
            live_reading[
                "last_history_saved_at"
            ] = now

            self._live_wearable_cache[
                device_id
            ] = live_reading

        # -----------------------------------------------------
        # RETURN LIVE DATA
        # -----------------------------------------------------

        return {
            **live_reading,
            "history_saved": history_saved,
        }

    # ---------------------------------------------------------
    # GET LIVE WEARABLE VITALS
    # ---------------------------------------------------------

    def get_live_wearable(
        self,
        patient_id: str,
    ):
        """
        Get the latest wearable values from RAM.

        NO FIRESTORE READ.
        """

        latest = None
        latest_time = None

        for reading in self._live_wearable_cache.values():

            if reading.get("patient_id") != patient_id:
                continue

            updated_at = reading.get(
                "updated_at"
            )

            if not isinstance(
                updated_at,
                datetime,
            ):
                continue

            if (
                latest_time is None
                or updated_at > latest_time
            ):
                latest_time = updated_at
                latest = reading

        return latest

    # ---------------------------------------------------------
    # LATEST VITALS
    # ---------------------------------------------------------

    def get_latest(self, patient_id: str):
        """
        Get latest patient vitals.

        First:
            Check live wearable RAM.

        If no live wearable data exists:
            Fall back to existing Firestore history.
        """

        # -----------------------------------------------------
        # LIVE CACHE FIRST
        # -----------------------------------------------------

        live_reading = self.get_live_wearable(
            patient_id
        )

        if live_reading is not None:
            return live_reading

        # -----------------------------------------------------
        # FIRESTORE FALLBACK
        # -----------------------------------------------------

        from app.database.firebase import db

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "patient_id",
                "==",
                patient_id,
            )
            .stream()
        )

        latest_reading = None
        latest_time = None

        for doc in docs:

            reading = doc.to_dict()

            recorded_at = reading.get(
                "recorded_at"
            )

            if not isinstance(
                recorded_at,
                datetime,
            ):
                continue

            if (
                latest_time is None
                or recorded_at > latest_time
            ):
                latest_time = recorded_at

                reading["id"] = doc.id

                latest_reading = reading

        return latest_reading

    # ---------------------------------------------------------
    # HISTORY
    # ---------------------------------------------------------

    def get_history(
        self,
        patient_id: str,
        limit: int = 100,
    ):
        """
        Get historical readings from Firestore.

        This does NOT include the RAM live cache.
        """

        from app.database.firebase import db

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "patient_id",
                "==",
                patient_id,
            )
            .stream()
        )

        readings = []

        for doc in docs:

            reading = doc.to_dict()

            reading["id"] = doc.id

            readings.append(reading)

        readings.sort(
            key=lambda x: x.get(
                "recorded_at",
                datetime.min,
            ),
            reverse=True,
        )

        return readings[:limit]