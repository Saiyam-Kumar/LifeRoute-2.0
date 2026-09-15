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


def health_agent(history: list[dict]) -> dict:
    """LifeRoute health-monitoring decision agent."""

    latest = get_latest_vitals(history)
    recent_history = get_vital_history(history)
    context = get_patient_health_context(recent_history)

    patient_id = latest.get("patient_id")
    risk_level = context["risk_level"]

    if risk_level == "CRITICAL":

        action = escalate_to_liferoute(
            patient_id,
            {
                "level": risk_level,
                "reasons": context["reasons"],
            },
        )

        decision = "ESCALATE_TO_LIFEROUTE"

    elif risk_level == "HIGH":

        action = create_doctor_alert(
            patient_id,
            {
                "level": risk_level,
                "reasons": context["reasons"],
            },
        )

        decision = "ALERT_DOCTOR"

    elif risk_level == "MODERATE":

        action = initiate_telemedicine(patient_id)

        decision = "MONITOR_AND_CONSIDER_TELEMEDICINE"

    else:

        action = {
            "action": "CONTINUE_MONITORING",
            "patient_id": patient_id,
        }

        decision = "CONTINUE_MONITORING"

    return {
        "patient_id": patient_id,

        "observation": {
            "latest_vitals": latest,
            "trends": context["trends"],
            "anomalies": context["anomalies"],
        },

        "risk": {
            "score": context["risk_score"],
            "level": risk_level,
            "reasons": context["reasons"],
        },

        "decision": decision,
        "action": action,
    }