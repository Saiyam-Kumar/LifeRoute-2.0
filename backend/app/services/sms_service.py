class SMSService:
    """Provider-independent emergency notification placeholder.

    This records a notification event for the LifeRoute demo.
    It does not send a real SMS.
    """

    def send_emergency_alert(
        self,
        to_phone: str,
        patient_name: str,
        ktas_level: int,
    ):
        if not to_phone:
            return {
                "success": False,
                "channel": "demo",
                "delivered": False,
                "reason": "Emergency contact phone number is missing.",
            }

        print(
            "[DEMO NOTIFICATION] "
            f"KTAS {ktas_level} emergency for {patient_name}. "
            "A real SMS was not sent."
        )

        return {
            "success": True,
            "channel": "demo",
            "delivered": False,
            "recipient": to_phone,
            "message": (
                f"LifeRoute emergency alert: {patient_name}, "
                f"KTAS Level {ktas_level}."
            ),
        }


sms_service = SMSService()
