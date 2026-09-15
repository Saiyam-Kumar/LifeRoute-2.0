from ai.health_monitoring.health_tools import (
    get_latest_vitals,
    get_vital_history,
    get_patient_health_context,
)

from ai.agent_actions import (
    create_doctor_alert,
    initiate_telemedicine,
    escalate_to_liferoute,
)


def run_health_agent(history: list[dict]) -> dict:
    """Observe → gather context → reason → act."""

    if not history:
        return {
            "status": "INSUFFICIENT_DATA",
            "decision": "REQUEST_MORE_DATA",
        }

    # OBSERVE
    latest = get_latest_vitals(history)

    # GATHER CONTEXT
    patient_context = get_patient_health_context(history)

    risk_level = patient_context["risk_level"]
    patient_id = latest["patient_id"]

    # REASON + ACT
    if risk_level == "CRITICAL":
        action = escalate_to_liferoute(
            patient_id,
            {
                "level": risk_level,
                "reasons": patient_context["reasons"],
            },
        )
        decision = "ESCALATE_TO_LIFEROUTE"

    elif risk_level == "HIGH":
        action = create_doctor_alert(
            patient_id,
            {
                "level": risk_level,
                "reasons": patient_context["reasons"],
            },
        )
        decision = "ALERT_DOCTOR"

    elif risk_level == "MODERATE":
        action = initiate_telemedicine(patient_id)
        decision = "CONSIDER_TELEMEDICINE"

    else:
        action = {
            "action": "CONTINUE_MONITORING",
            "patient_id": patient_id,
        }
        decision = "CONTINUE_MONITORING"

    return {
        "patient_id": patient_id,
        "observation": latest,
        "context": patient_context,
        "decision": decision,
        "action": action,
    }