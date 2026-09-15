from ai.health_monitoring.health_tools import (
    get_latest_vitals,
    get_patient_health_context,
)

from ai.agent_actions import (
    create_doctor_alert,
    initiate_telemedicine,
    escalate_to_liferoute,
)

from ai.agent_policy import is_action_allowed


def run_agent_loop(history: list[dict]) -> dict:
    """
    LifeRoute agent loop:

    Observe → Gather → Analyze → Decide → Policy → Act
    """

    if not history:
        return {
            "status": "INSUFFICIENT_DATA",
            "decision": "REQUEST_MORE_DATA",
            "action": None,
        }

    # --------------------------------------------------
    # 1. OBSERVE
    # --------------------------------------------------

    latest = get_latest_vitals(history)
    patient_id = latest["patient_id"]

    # --------------------------------------------------
    # 2. GATHER + ANALYZE
    # --------------------------------------------------

    context = get_patient_health_context(history)

    risk_level = context["risk_level"]

    # --------------------------------------------------
    # 3. DECIDE
    # --------------------------------------------------

    if risk_level == "CRITICAL":
        decision = "ESCALATE_TO_LIFEROUTE"

    elif risk_level == "HIGH":
        decision = "ALERT_DOCTOR"

    elif risk_level == "MODERATE":
        decision = "CONSIDER_TELEMEDICINE"

    else:
        decision = "CONTINUE_MONITORING"

    # --------------------------------------------------
    # 4. POLICY CHECK
    # --------------------------------------------------

    if not is_action_allowed(risk_level, decision):
        return {
            "patient_id": patient_id,
            "status": "ACTION_BLOCKED",
            "risk_level": risk_level,
            "decision": decision,
            "action": None,
        }

    # --------------------------------------------------
    # 5. ACT
    # --------------------------------------------------

    risk = {
        "level": risk_level,
        "reasons": context["reasons"],
    }

    if decision == "ESCALATE_TO_LIFEROUTE":

        action = escalate_to_liferoute(
            patient_id,
            risk,
        )

    elif decision == "ALERT_DOCTOR":

        action = create_doctor_alert(
            patient_id,
            risk,
        )

    elif decision == "CONSIDER_TELEMEDICINE":

        action = initiate_telemedicine(
            patient_id,
        )

    else:

        action = {
            "tool": "continue_monitoring",
            "patient_id": patient_id,
            "status": "MONITORING",
        }

    # --------------------------------------------------
    # 6. RETURN AGENT STATE
    # --------------------------------------------------

    return {
        "patient_id": patient_id,
        "status": "ACTION_SELECTED",
        "observation": latest,
        "health_context": context,
        "decision": decision,
        "action": action,
    }