from .health_analyzer import analyze_health


def get_latest_vitals(history: list[dict]) -> dict:
    """Return the patient's latest available vital reading."""
    if not history:
        return {}

    return history[-1]


def get_vital_history(history: list[dict]) -> list[dict]:
    """Return recent patient health history."""
    return history


def analyze_patient_health(history: list[dict]) -> dict:
    """Analyze trends, anomalies, baseline and risk."""
    return analyze_health(history)


def get_patient_health_context(history: list[dict]) -> dict:
    """Provide the agent with a compact patient health context."""

    latest = get_latest_vitals(history)
    analysis = analyze_patient_health(history)

    return {
        "latest_vitals": latest,
        "baseline": analysis["baseline"],
        "trends": analysis["trends"],
        "anomalies": analysis["anomalies"],
        "risk_score": analysis["risk_score"],
        "risk_level": analysis["risk_level"],
        "reasons": analysis["reasons"],
    }