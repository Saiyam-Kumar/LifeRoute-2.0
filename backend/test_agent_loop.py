from ai.agent_loop import run_agent_loop


history = [
    {
        "patient_id": "P001",
        "device_id": "D001",
        "timestamp": "2026-08-29T09:00:00",
        "heart_rate": 82,
        "spo2": 97,
        "temperature": 36.7,
        "activity": 0.42,
    },
    {
        "patient_id": "P001",
        "device_id": "D001",
        "timestamp": "2026-08-29T12:00:00",
        "heart_rate": 91,
        "spo2": 96,
        "temperature": 36.9,
        "activity": 0.38,
    },
    {
        "patient_id": "P001",
        "device_id": "D001",
        "timestamp": "2026-08-29T15:00:00",
        "heart_rate": 102,
        "spo2": 94,
        "temperature": 37.1,
        "activity": 0.31,
    },
    {
        "patient_id": "P001",
        "device_id": "D001",
        "timestamp": "2026-08-29T18:00:00",
        "heart_rate": 111,
        "spo2": 93,
        "temperature": 37.4,
        "activity": 0.24,
    },
    {
        "patient_id": "P001",
        "device_id": "D001",
        "timestamp": "2026-08-29T21:00:00",
        "heart_rate": 118,
        "spo2": 91,
        "temperature": 37.8,
        "activity": 0.18,
    },
]


result = run_agent_loop(history)

print(result)