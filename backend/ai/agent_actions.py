def create_doctor_alert(patient_id: str, risk: dict) -> dict:
    """
    Prepare a doctor alert.

    Actual delivery/storage will later be handled by the backend.
    """

    return {
        "tool": "create_doctor_alert",
        "patient_id": patient_id,
        "priority": risk["level"],
        "reasons": risk["reasons"],
        "status": "READY_FOR_BACKEND",
    }


def initiate_telemedicine(patient_id: str) -> dict:
    """
    Request a telemedicine intervention.

    Actual scheduling/communication will later be handled
    by the backend.
    """

    return {
        "tool": "initiate_telemedicine",
        "patient_id": patient_id,
        "status": "READY_FOR_BACKEND",
    }


def escalate_to_liferoute(patient_id: str, risk: dict) -> dict:
    """
    Request emergency escalation into the existing LifeRoute
    emergency-routing workflow.

    This function does NOT directly modify the existing
    emergency engine yet.
    """

    return {
        "tool": "escalate_to_liferoute",
        "patient_id": patient_id,
        "risk_level": risk["level"],
        "reasons": risk["reasons"],
        "status": "READY_FOR_BACKEND",
    }