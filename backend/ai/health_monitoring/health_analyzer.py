from statistics import mean


def calculate_baseline(history: list[dict]) -> dict:
    """Calculate a patient's baseline from historical readings."""

    if not history:
        return {
            "heart_rate": None,
            "spo2": None,
            "temperature": None,
            "activity": None,
        }

    return {
        "heart_rate": round(mean(r["heart_rate"] for r in history), 2),
        "spo2": round(mean(r["spo2"] for r in history), 2),
        "temperature": round(
            mean(r["temperature"] for r in history), 2
        ),
        "activity": round(
            mean(r["activity"] for r in history), 2
        ),
    }


def analyze_trends(history: list[dict]) -> dict:
    """Detect directional changes in recent health readings."""

    if len(history) < 2:
        return {
            "heart_rate": "INSUFFICIENT_DATA",
            "spo2": "INSUFFICIENT_DATA",
            "temperature": "INSUFFICIENT_DATA",
            "activity": "INSUFFICIENT_DATA",
        }

    previous = history[-2]
    current = history[-1]

    def direction(current_value, previous_value):
        if current_value > previous_value:
            return "INCREASING"
        if current_value < previous_value:
            return "DECREASING"
        return "STABLE"

    return {
        "heart_rate": direction(
            current["heart_rate"],
            previous["heart_rate"],
        ),
        "spo2": direction(
            current["spo2"],
            previous["spo2"],
        ),
        "temperature": direction(
            current["temperature"],
            previous["temperature"],
        ),
        "activity": direction(
            current["activity"],
            previous["activity"],
        ),
    }
    
def detect_anomalies(history: list[dict]) -> list[str]:
    """Detect unusual changes compared with the patient's recent baseline."""

    if len(history) < 3:
        return []

    baseline = calculate_baseline(history[:-1])
    current = history[-1]

    anomalies = []

    if baseline["heart_rate"] is not None:
        if abs(current["heart_rate"] - baseline["heart_rate"]) >= 20:
            anomalies.append("Heart rate significantly differs from baseline")

    if baseline["spo2"] is not None:
        if current["spo2"] <= baseline["spo2"] - 3:
            anomalies.append("SpO₂ significantly differs from baseline")

    if baseline["temperature"] is not None:
        if abs(current["temperature"] - baseline["temperature"]) >= 1.0:
            anomalies.append("Temperature significantly differs from baseline")

    if baseline["activity"] is not None:
        if current["activity"] <= baseline["activity"] * 0.5:
            anomalies.append("Activity is significantly below baseline")

    return anomalies


def calculate_risk(history: list[dict]) -> dict:
    """
    Produce an initial health-risk assessment.

    This is an explainable prototype risk engine, not a
    clinically validated medical model.
    """

    if not history:
        return {
            "risk_score": 0.0,
            "risk_level": "UNKNOWN",
            "reasons": [],
            "recommended_action": "NO_DATA",
        }

    current = history[-1]
    trends = analyze_trends(history)

    score = 0.0
    reasons = []

    # Oxygen saturation
    if current["spo2"] < 92:
        score += 0.40
        reasons.append("SpO₂ is critically low")
    elif current["spo2"] < 95:
        score += 0.20
        reasons.append("SpO₂ is below normal range")

    if trends["spo2"] == "DECREASING":
        score += 0.15
        reasons.append("SpO₂ is declining")

    # Heart rate
    if current["heart_rate"] > 120:
        score += 0.25
        reasons.append("Heart rate is very high")
    elif current["heart_rate"] > 100:
        score += 0.15
        reasons.append("Heart rate is elevated")

    if trends["heart_rate"] == "INCREASING":
        score += 0.10
        reasons.append("Heart rate is increasing")

    # Temperature
    if current["temperature"] >= 38:
        score += 0.15
        reasons.append("Temperature is elevated")

    # Activity
    if current["activity"] < 0.20:
        score += 0.10
        reasons.append("Activity level is unusually low")

    score = min(round(score, 2), 1.0)

    if score >= 0.70:
        risk_level = "CRITICAL"
        action = "EMERGENCY_ESCALATION"
    elif score >= 0.45:
        risk_level = "HIGH"
        action = "DOCTOR_ALERT"
    elif score >= 0.20:
        risk_level = "MODERATE"
        action = "MONITOR_CLOSELY"
    else:
        risk_level = "LOW"
        action = "CONTINUE_MONITORING"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommended_action": action,
    }


def analyze_health(history: list[dict]) -> dict:
    """Run the complete health-intelligence pipeline."""

    baseline = calculate_baseline(history)
    trends = analyze_trends(history)
    anomalies = detect_anomalies(history)
    risk = calculate_risk(history)

    return {
        "patient_id": history[-1]["patient_id"] if history else None,
        "baseline": baseline,
        "trends": trends,
        "anomalies": anomalies,
        **risk,
    }