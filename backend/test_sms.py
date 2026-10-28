from app.services.sms_service import sms_service

result = sms_service.send_emergency_alert(
    to_phone="+919736245361",
    patient_name="LifeRoute Test Patient",
    ktas_level=1,
)

print(result)