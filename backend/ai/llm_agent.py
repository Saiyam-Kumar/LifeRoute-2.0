import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


from ai.health_monitoring.health_tools import get_patient_health_context


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


SYSTEM_PROMPT = """
You are the LifeRoute Health Intelligence Agent.

Your role is to interpret structured health-monitoring information
and provide a concise, explainable clinical-support assessment.

IMPORTANT:
- Do not diagnose diseases.
- Do not invent medical information.
- Do not override the deterministic risk score or risk level.
- Treat CRITICAL as requiring emergency escalation.
- Treat HIGH as requiring doctor review.
- Treat MODERATE as requiring closer monitoring.
- Treat LOW as continued monitoring.

Return ONLY valid JSON with:

{
  "summary": "...",
  "reasoning": ["...", "..."],
  "recommended_action": "...",
  "confidence": 0.0
}
"""


def run_llm_reasoning(history: list[dict]) -> dict:
    """Use the LLM to explain and contextualize deterministic health analysis."""

    context = get_patient_health_context(history)

    response = client.responses.create(
        model="gpt-5-mini",
        instructions=SYSTEM_PROMPT,
        input=json.dumps(context),
    )

    text = response.output_text

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        result = {
            "summary": text,
            "reasoning": [],
            "recommended_action": "FOLLOW_DETERMINISTIC_RISK",
            "confidence": 0.0,
        }

    # Safety gate: LLM cannot override our deterministic risk engine.
    risk_level = context["risk_level"]

    if risk_level == "CRITICAL":
        result["recommended_action"] = "EMERGENCY_ESCALATION"

    elif risk_level == "HIGH":
        result["recommended_action"] = "DOCTOR_ALERT"

    elif risk_level == "MODERATE":
        result["recommended_action"] = "MONITOR_CLOSELY"

    else:
        result["recommended_action"] = "CONTINUE_MONITORING"

    return {
        "patient_id": history[-1]["patient_id"],
        "health_context": context,
        "llm_reasoning": result,
    }