import json
import os
import time

import requests
import serial
from dotenv import load_dotenv

load_dotenv("backend/.env")

SERIAL_PORT = "/dev/cu.usbserial-A5069RR4"
BAUD_RATE = 115200
BACKEND_URL = "http://127.0.0.1:8000/wearable/vitals"

DEVICE_ID = os.getenv("WEARABLE_DEVICE_ID", "LR-WEARABLE-001")
DEVICE_KEY = os.getenv("WEARABLE_DEVICE_KEY")

if not DEVICE_KEY:
    raise RuntimeError(
        "WEARABLE_DEVICE_KEY is missing from backend/.env. "
        "Do not hardcode or share the device key."
    )


def main():
    print(f"Opening ESP32 serial port {SERIAL_PORT}...")
    with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
        time.sleep(2)
        print("ESP32 connected. Waiting for payloads...")

        while True:
            try:
                line = ser.readline().decode("utf-8", errors="ignore").strip()
                if not line:
                    continue
                print("ESP32:", line)

                if not line.startswith("Payload:"):
                    continue

                try:
                    data = json.loads(line[len("Payload:"):].strip())
                except json.JSONDecodeError:
                    print("Invalid JSON payload.")
                    continue

                payload = {
                    key: data[key]
                    for key in ("heart_rate", "spo2", "activity", "temperature")
                    if data.get(key) is not None
                }

                print("Sending:", json.dumps(payload))
                try:
                    response = requests.post(
                        BACKEND_URL,
                        headers={
                            "Content-Type": "application/json",
                            "x-device-id": DEVICE_ID,
                            "x-device-key": DEVICE_KEY,
                        },
                        json=payload,
                        timeout=5,
                    )
                    print("Backend HTTP:", response.status_code)
                    print("Backend:", response.text)
                except requests.RequestException as exc:
                    print("Backend connection error:", exc)

            except KeyboardInterrupt:
                print("\nStopping USB bridge.")
                break


if __name__ == "__main__":
    main()
