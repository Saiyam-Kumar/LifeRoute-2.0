from typing import Literal

from pydantic import BaseModel


EmergencyStatus = Literal[
    "incoming",
    "accepted",
    "preparing",
    "patient_arrived",
    "completed",
]


class EmergencyStatusUpdate(BaseModel):
    status: EmergencyStatus
