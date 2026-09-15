ALLOWED_ACTIONS = {
    "LOW": [
        "CONTINUE_MONITORING",
    ],
    "MODERATE": [
        "CONTINUE_MONITORING",
        "CONSIDER_TELEMEDICINE",
    ],
    "HIGH": [
        "ALERT_DOCTOR",
        "CONSIDER_TELEMEDICINE",
    ],
    "CRITICAL": [
        "ESCALATE_TO_LIFEROUTE",
    ],
}


def is_action_allowed(risk_level: str, action: str) -> bool:
    """Check whether an agent action is permitted for the risk level."""

    return action in ALLOWED_ACTIONS.get(risk_level, [])