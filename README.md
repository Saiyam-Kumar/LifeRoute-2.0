# 🚑 LifeRoute 2.0

### AI-Powered Emergency Triage, Wearable Vital Monitoring & Intelligent Hospital Routing

**The Right Care. At The Right Time.**

LifeRoute 2.0 combines AI-assisted emergency assessment with a
hardware-based wearable prototype that collects vital-sign and activity
data. The platform is designed to help assess a patient's condition,
estimate required medical resources, and recommend a suitable hospital
using resource compatibility, availability data, distance, and estimated
travel time.


------------------------------------------------------------------------

## 📌 Overview

During an emergency, the nearest hospital is not always the most
suitable one. A patient may need a specialist, ICU support, respiratory
support, or trauma care that is not available at the closest facility.

**LifeRoute 2.0 adds a hardware-based vital-monitoring layer to
LifeRoute's resource-aware emergency routing workflow.** The wearable
prototype is built around an ESP32 and sensor modules intended to
capture pulse/SpO₂, temperature, and movement-related readings. Readings
can be sent to the FastAPI backend and stored in Firebase/Cloud
Firestore for retrieval by patient and device.

The platform combines:

-   Wearable-based vital data collection (hardware prototype)
-   Emergency assessment and KTAS-based triage logic
-   Medical complaint classification and resource prediction
-   Hospital capability matching and ranking
-   Distance and estimated travel time (ETA) calculation
-   Patient and hospital application workflows

> **Important:** LifeRoute 2.0 is a prototype for educational, research,
> and hackathon use. It is not a certified medical device, and its
> readings or recommendations must not be used as a substitute for
> professional medical assessment or emergency services.

## 🎯 Problem Statement

Conventional hospital-finder applications often prioritize proximity
without adequately considering whether a facility can treat the
patient's condition. In an emergency, this may contribute to unsuitable
referrals, transfers, and delays.

LifeRoute aims to improve the decision-support process by combining
patient-reported information, available vital readings, predicted
resource requirements, hospital capability data, and route estimates.

## 💡 How It Works

``` text
Wearable Sensors
      │
      ▼
ESP32 Microcontroller
      │
      ▼
Vital Readings / Device Data
      │
      ▼
FastAPI Backend ───────────────► Firebase / Cloud Firestore
      │                                  │
      ▼                                  ▼
Emergency Assessment              Latest / Historical Readings
      │
      ▼
KTAS-Based Triage + Complaint Classification
      │
      ▼
Medical Resource Prediction
      │
      ▼
Hospital Capability Matching
      │
      ▼
Distance + ETA Calculation
      │
      ▼
Hospital Ranking → Recommended Hospital
```

The exact hardware-to-server transport depends on the firmware and
network configuration used by the deployed prototype. The architecture
is intended to support sending device readings to the backend over a
network connection; it should not be described as a verified
continuous-monitoring system unless that behavior has been tested on the
actual hardware.

## ✨ Key Features

### ❤️ Hardware-Integrated Vital Monitoring

The LifeRoute 2.0 prototype includes an ESP32-based wearable setup with
sensor modules intended to collect physiological and movement data:

-   **MAX30102:** pulse oximetry sensor intended for heart-rate and SpO₂
    readings
-   **MAX30205:** temperature sensor
-   **MPU6050:** accelerometer and gyroscope for movement/activity
    signals
-   **SSD1306 OLED:** small display for local device output
-   **ESP32 DevKit:** microcontroller for sensor interfacing and data
    transmission
-   **LiPo battery + TP4056 charging module:** portable power prototype

Sensor readings are subject to sensor placement, calibration, firmware,
electrical design, and environmental conditions. The hardware should be
treated as a prototype, not as clinically validated equipment.

### 🧠 AI-Assisted Emergency Assessment

The application evaluates information such as the patient's chief
complaint, available vital signs, and location. The existing decision
pipeline uses rule-based logic and KTAS-based triage concepts to help
estimate severity and resources.

### 🩺 Medical Complaint Classification

  Category             Example complaints
  -------------------- -------------------------------------------
  Cardiology           Chest pain, palpitations, syncope
  Neurology            Seizure, headache, dizziness, head trauma
  Respiratory          Shortness of breath
  Trauma               Open wound, burn, heavy bleeding
  Orthopedic           Fracture, arm/leg pain
  Gastrointestinal     Abdominal pain, vomiting
  Ophthalmology        Ocular pain
  ENT                  Throat pain
  Infectious           Fever
  Critical emergency   High-acuity conditions

### 🧬 Resource Prediction

Example mappings used by the decision logic may include:

  -----------------------------------------------------------------------
  Complaint / signal                  Potential resources to consider
  ----------------------------------- -----------------------------------
  Chest pain                          ECG, cardiologist, cardiac
                                      monitoring

  Seizure                             CT scan, neurologist, ICU

  Shortness of breath                 Oxygen, ventilatory support,
                                      pulmonologist

  Heavy bleeding                      Trauma team, general surgeon, blood
                                      bank

  Fracture                            X-ray, orthopedic surgeon

  Low SpO₂                            Further clinical assessment;
                                      possible respiratory support

  Abnormal heart rate                 Further clinical assessment and
                                      possible cardiac monitoring
  -----------------------------------------------------------------------

These are illustrative decision-support mappings, not medical
instructions or definitive diagnoses.

### 🏥 Intelligent Hospital Matching

Hospitals are compared against predicted resource requirements, listed
capabilities, operational status, distance, and estimated travel time.
The nearest hospital is not automatically selected if another candidate
better matches the required resources.

The demonstration dataset may contain simulated bed counts,
ICU/ventilator availability, specialists, and operational status. These
fields must not be interpreted as real-time verified hospital capacity.

### 🗺️ Route and ETA Estimation

LifeRoute uses OpenRouteService for driving routes, distance, and
estimated travel time, with a local geographic fallback where
implemented.

### 🔐 Authentication and Portals

The application uses Firebase Authentication and role-specific workflows
for patients and hospitals. Protected backend operations should verify
authentication tokens before allowing access.

## 🔌 Hardware Components

  -----------------------------------------------------------------------
  Component                           Purpose
  ----------------------------------- -----------------------------------
  ESP32 DevKit                        Reads sensor modules and handles
                                      device-side processing/connectivity

  MAX30102                            Pulse oximetry sensor for
                                      heart-rate and SpO₂ estimates

  MAX30205                            Temperature measurement

  MPU6050                             Motion sensing using accelerometer
                                      and gyroscope

  SSD1306 OLED                        Local display for selected
                                      readings/status

  LiPo battery                        Portable power source

  TP4056 module                       LiPo charging module; use a
                                      suitable protected design
  -----------------------------------------------------------------------

**Electrical and safety note:** Confirm each module's operating voltage,
I²C address, pinout, charging requirements, and current draw from its
datasheet before wiring. Do not connect a LiPo battery or charging
circuit without understanding the board's protection and power
requirements. The pin mapping is intentionally not specified here
because it must match the actual wiring and firmware.

## 📡 Vital Data API

The backend's vital-reading workflow is designed around these endpoints:

  ------------------------------------------------------------------------------------------
  Method                  Endpoint                                   Purpose
  ----------------------- ------------------------------------------ -----------------------
  `POST`                  `/vitals/`                                 Submit a vital-reading
                                                                     record

  `GET`                   `/vitals/latest/{patient_id}`              Retrieve the latest
                                                                     reading for a patient

  `GET`                   `/vitals/history/{patient_id}?limit=100`   Retrieve reading
                                                                     history, with a
                                                                     configurable limit
  ------------------------------------------------------------------------------------------

A reading may contain fields such as:

``` json
{
  "patient_id": "demo-patient-001",
  "device_id": "liferoute-wearable-001",
  "timestamp": "2026-10-12T10:30:00Z",
  "heart_rate": 82,
  "spo2": 98,
  "temperature": 36.8,
  "activity": "walking"
}
```

This is an **illustrative payload only**. Use the exact schema expected
by the current backend. Fields may be optional, and server-generated
fields such as record IDs or recorded timestamps may be added by the
backend.

Readings are stored in the `health_readings` Firestore collection in the
described implementation. Access should be restricted to authorized
users, and patient data should not be exposed in public logs or
repositories.

## 🧠 Emergency Decision Pipeline

  -----------------------------------------------------------------------
  Stage                               Description
  ----------------------------------- -----------------------------------
  1\. Patient input                   Chief complaint, available vital
                                      signs, and location

  2\. Vital retrieval                 Read available data from the
                                      wearable/backend workflow

  3\. KTAS-based triage               Estimate emergency severity using
                                      the implemented assessment logic

  4\. Complaint classification        Map the complaint to a medical
                                      category

  5\. Resource prediction             Estimate potentially required
                                      resources using category, triage,
                                      and available signals

  6\. Hospital matching               Compare predicted needs with
                                      hospital capabilities

  7\. Route calculation               Estimate distance and driving ETA

  8\. Hospital ranking                Rank candidates using resource
                                      compatibility, ETA, and status

  9\. Recommendation                  Return the highest-ranked suitable
                                      candidate
  -----------------------------------------------------------------------

The availability of wearable readings does not mean that every sensor
measurement automatically triggers a diagnosis or emergency dispatch.
Any alerting behavior must be explicitly implemented and tested.

## 🎯 Resource-First Hospital Ranking

The existing prototype describes a weighted ranking approach:

``` text
Final Score = Resource Match × 70%
            + ETA Score × 25%
            + Open Status × 5%
```

The score and weights are implementation-specific and should be reviewed
and validated before any real-world use. A production system would
require clinically reviewed decision logic and reliable, continuously
updated hospital data.

## 🏗️ System Architecture

``` text
[ESP32 + Sensors]
        │
        ▼
[Device Firmware / Network Transport]
        │
        ▼
[FastAPI Backend] ───────────► [Cloud Firestore]
        │                       ├── health_readings
        │                       ├── patients
        │                       ├── hospitals
        │                       └── users
        │
        ├── [Triage / Resource Logic]
        ├── [Hospital Ranking]
        └── [OpenRouteService]
                    │
                    ▼
           [React + Vite Frontend]
```

The diagram is a conceptual architecture. The actual deployment and
transport path should reflect the current firmware and API
implementation.

## 🛠️ Technology Stack

**Frontend** - React - Vite - React Router - Tailwind CSS - Axios -
Framer Motion - Lucide React

**Backend** - Python - FastAPI - Pydantic - Uvicorn

**AI / Decision Support** - KTAS-based triage logic - Medical complaint
classification - Rule-based resource prediction - Vital-sign rule
evaluation - Hospital matching and ranking

**Database and Authentication** - Firebase Authentication - Cloud
Firestore - Firebase Admin SDK

**Routing** - OpenRouteService API - Browser Geolocation API

**Hardware** - ESP32 DevKit - MAX30102 - MAX30205 - MPU6050 - SSD1306
OLED - LiPo battery and TP4056 charging module

**Deployment** - Vercel for the frontend - Render for the backend -
Firebase services

## 📂 Project Structure

The structure below reflects the described software architecture. Add or
adjust firmware paths to match the actual repository layout.

``` text
LifeRoute/
├── backend/
│   ├── ai/
│   │   ├── hospital_engine/
│   │   │   └── hospital_ranker.py
│   │   ├── resource_engine/
│   │   │   ├── category_resources.py
│   │   │   ├── medical_categories.py
│   │   │   ├── ktas_rules.py
│   │   │   └── vital_rules.py
│   │   └── predictor.py
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   └── services/
│   ├── data/
│   │   └── hospitals_seed.json
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       └── services/
├── hardware/                 # Add firmware and wiring documentation here
│   ├── firmware/
│   └── README.md
├── docs/
│   └── screenshots/
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Git
-   Node.js and npm
-   Python 3.10 or later (use the version supported by your
    dependencies)
-   A Firebase project with Authentication and Cloud Firestore
    configured
-   An OpenRouteService API key
-   ESP32 development environment and compatible sensor modules, if
    testing hardware

### 1. Clone the repository

``` bash
git clone https://github.com/Saiyam-Kumar/LifeRoute.git
cd LifeRoute
```

### 2. Configure and run the backend

``` bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Configure the required Firebase credentials and `ORS_API_KEY` using the
environment variables expected by the current backend. Prefer a local
`.env` file or your hosting provider's secret manager.

Start the API:

``` bash
uvicorn app.main:app --reload
```

The API should be available at `http://127.0.0.1:8000`, and the
interactive API documentation at `http://127.0.0.1:8000/docs`, if
enabled by the application.

### 3. Configure and run the frontend

Open a second terminal:

``` bash
cd frontend
npm install
npm run dev
```

Set the frontend Firebase configuration and backend API base URL using
the environment variable names expected by the frontend. Open the local
URL printed by Vite.

### 4. Prepare the wearable hardware

1.  Verify the exact sensor boards and their datasheets.
2.  Wire the sensors to the ESP32 using a compatible voltage level and
    the pin mapping used in your firmware.
3.  Test each sensor independently before combining them.
4.  Confirm that the firmware reads values reliably and handles missing
    or invalid readings.
5.  Configure the device's network connection and API destination as
    required by the implemented firmware.
6.  Send a test reading to `POST /vitals/` and verify that the backend
    accepts it.
7.  Confirm that the reading is stored and can be retrieved from the
    latest/history endpoints.
8.  Test disconnects, reconnects, invalid sensor values, and low-battery
    behavior before demonstrations.

**Firmware note:** This README does not assume a particular
Arduino/PlatformIO project, pin assignment, Wi-Fi provisioning method,
or firmware command because those details must match the hardware
repository.

## 🧪 Example Scenario

A patient reports chest pain and the available readings show an elevated
heart rate. The application classifies the complaint, applies its
configured triage/resource rules, compares the predicted resource needs
against the hospital dataset, and ranks candidate hospitals using
resource compatibility and route estimates.

The output is a prototype decision-support recommendation. It must be
checked by qualified professionals and must not delay emergency care.

## 🔐 Security and Privacy

-   Never commit `.env` files, Firebase service-account keys, API
    secrets, or device credentials.
-   Keep the OpenRouteService key on the backend; do not expose it in
    browser code.
-   Require authentication and authorization for protected patient and
    hospital data.
-   Apply restrictive Firestore security rules and backend access
    checks.
-   Avoid logging personally identifiable or sensitive health
    information.
-   Use synthetic/demo data during development and demonstrations.
-   Obtain appropriate consent and follow applicable privacy
    requirements before collecting real health data.

## 📊 Demo Data and Limitations

The hospital dataset may include public hospital information alongside
prototype/simulated values for beds, ICU capacity, ventilators,
specialist availability, resources, and operational status. Unless
connected to a verified live source, these fields are **not real-time
hospital availability**.

Wearable readings can be affected by motion, sensor placement,
calibration, power stability, and connectivity. Missing, delayed, or
inaccurate readings must not be treated as normal readings.

## 🔮 Future Scope

-   Improve wearable firmware reliability and sensor calibration
-   Add robust device pairing and secure device identity
-   Build a patient-facing vital history and device status dashboard
-   Add carefully validated alerts for missing or abnormal readings
-   Integrate verified, continuously updated hospital capacity feeds
-   Explore ambulance discovery, dispatch support, and live tracking
-   Add multilingual support, including Hindi and Punjabi
-   Evaluate clinical decision-support logic with qualified healthcare
    professionals
-   Conduct security, privacy, usability, and regulatory reviews before
    real-world deployment

## ⚠️ Medical Disclaimer

LifeRoute 2.0 is a prototype for educational, research, and hackathon
purposes. It is **not a medical device** and is not intended to
diagnose, treat, monitor, or prevent any disease. It does not replace
professional medical judgment, emergency services, or hospital triage
personnel.

Do not rely on this prototype's sensor readings, triage output, or
hospital data to make real emergency decisions. In an emergency, contact
local emergency medical services and qualified healthcare professionals.

## 👥 Team

**Contributors:** Saiyam Kumar · Stuti Sharma

Built around AI-assisted decision support, full-stack development,
database integration, wearable hardware prototyping, and emergency
healthcare workflow design.

### 🚑 LifeRoute 2.0

**Sense. Assess. Match. Route.**

*The Right Care. At The Right Time.*
:::
