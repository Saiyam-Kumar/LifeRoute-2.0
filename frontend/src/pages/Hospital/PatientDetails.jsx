import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  HeartPulse,
  Wind,
  Thermometer,
  Activity,
  AlertTriangle,
  BedDouble,
  Stethoscope,
  Clock,
} from "lucide-react";

const PATIENT_DATA = {
  P001: {
    id: "P001",
    name: "Patient P001",
    age: 64,
    gender: "Male",
    risk: "CRITICAL",
    riskScore: 0.9,
    condition: "Deteriorating",
    heartRate: 118,
    spo2: 91,
    temperature: 37.8,
    activity: 0.18,
    updated: "Just now",
    reasons: [
      "SpO₂ is critically low",
      "SpO₂ is declining",
      "Heart rate is elevated",
      "Heart rate is increasing",
      "Activity level is unusually low",
    ],
    resources: [
      "ICU bed",
      "Oxygen support",
      "Continuous monitoring",
    ],
    routing: "Emergency routing required",
    history: [
      { time: "09:00", hr: 82, spo2: 97, temp: 36.7, activity: 0.42 },
      { time: "12:00", hr: 91, spo2: 96, temp: 36.9, activity: 0.38 },
      { time: "15:00", hr: 102, spo2: 94, temp: 37.1, activity: 0.31 },
      { time: "18:00", hr: 111, spo2: 93, temp: 37.4, activity: 0.24 },
      { time: "21:00", hr: 118, spo2: 91, temp: 37.8, activity: 0.18 },
    ],
  },

  P014: {
    id: "P014",
    name: "Patient P014",
    age: 52,
    gender: "Female",
    risk: "HIGH",
    riskScore: 0.72,
    condition: "Needs monitoring",
    heartRate: 108,
    spo2: 94,
    temperature: 37.4,
    activity: 0.28,
    updated: "2 min ago",
    reasons: [
      "Heart rate is elevated",
      "SpO₂ is below normal range",
      "Activity level is reduced",
    ],
    resources: [
      "General bed",
      "Continuous monitoring",
    ],
    routing: "Clinical monitoring recommended",
    history: [
      { time: "09:00", hr: 88, spo2: 97, temp: 36.7, activity: 0.46 },
      { time: "12:00", hr: 94, spo2: 96, temp: 36.9, activity: 0.41 },
      { time: "15:00", hr: 99, spo2: 95, temp: 37.0, activity: 0.35 },
      { time: "18:00", hr: 104, spo2: 95, temp: 37.2, activity: 0.31 },
      { time: "21:00", hr: 108, spo2: 94, temp: 37.4, activity: 0.28 },
    ],
  },

  P021: {
    id: "P021",
    name: "Patient P021",
    age: 47,
    gender: "Male",
    risk: "MEDIUM",
    riskScore: 0.48,
    condition: "Under observation",
    heartRate: 96,
    spo2: 96,
    temperature: 37.1,
    activity: 0.39,
    updated: "5 min ago",
    reasons: [
      "Heart rate slightly elevated",
      "Temperature trending upward",
    ],
    resources: [
      "General bed",
      "Routine monitoring",
    ],
    routing: "Observation recommended",
    history: [
      { time: "09:00", hr: 84, spo2: 98, temp: 36.6, activity: 0.48 },
      { time: "12:00", hr: 87, spo2: 98, temp: 36.7, activity: 0.46 },
      { time: "15:00", hr: 91, spo2: 97, temp: 36.9, activity: 0.43 },
      { time: "18:00", hr: 94, spo2: 97, temp: 37.0, activity: 0.41 },
      { time: "21:00", hr: 96, spo2: 96, temp: 37.1, activity: 0.39 },
    ],
  },

  P008: {
    id: "P008",
    name: "Patient P008",
    age: 31,
    gender: "Female",
    risk: "STABLE",
    riskScore: 0.12,
    condition: "Stable",
    heartRate: 78,
    spo2: 98,
    temperature: 36.6,
    activity: 0.55,
    updated: "8 min ago",
    reasons: [
      "Current vital indicators are within normal range",
    ],
    resources: [
      "Routine monitoring",
    ],
    routing: "No emergency routing required",
    history: [
      { time: "09:00", hr: 76, spo2: 98, temp: 36.5, activity: 0.52 },
      { time: "12:00", hr: 79, spo2: 98, temp: 36.6, activity: 0.55 },
      { time: "15:00", hr: 77, spo2: 97, temp: 36.6, activity: 0.51 },
      { time: "18:00", hr: 80, spo2: 98, temp: 36.7, activity: 0.57 },
      { time: "21:00", hr: 78, spo2: 98, temp: 36.6, activity: 0.55 },
    ],
  },

  P017: {
    id: "P017",
    name: "Patient P017",
    age: 59,
    gender: "Male",
    risk: "HIGH",
    riskScore: 0.68,
    condition: "Needs monitoring",
    heartRate: 104,
    spo2: 93,
    temperature: 37.5,
    activity: 0.25,
    updated: "10 min ago",
    reasons: [
      "SpO₂ is below normal range",
      "Heart rate is elevated",
      "Activity level is reduced",
    ],
    resources: [
      "General bed",
      "Oxygen monitoring",
    ],
    routing: "Clinical review recommended",
    history: [
      { time: "09:00", hr: 87, spo2: 97, temp: 36.8, activity: 0.44 },
      { time: "12:00", hr: 92, spo2: 96, temp: 37.0, activity: 0.39 },
      { time: "15:00", hr: 97, spo2: 95, temp: 37.2, activity: 0.34 },
      { time: "18:00", hr: 101, spo2: 94, temp: 37.4, activity: 0.29 },
      { time: "21:00", hr: 104, spo2: 93, temp: 37.5, activity: 0.25 },
    ],
  },
};

const riskStyles = {
  CRITICAL: {
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
  HIGH: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
  },
  MEDIUM: {
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-400",
  },
  STABLE: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

export default function PatientDetails() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  const patient = PATIENT_DATA[patientId] || PATIENT_DATA.P001;
  const style = riskStyles[patient.risk];

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">

      {/* Back */}
      <button
        onClick={() => navigate("/hospital/patients")}
        className="mb-7 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Patients
      </button>

      {/* Patient header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">
              Patient Record
            </span>

            <span className="text-white/20">•</span>

            <span className="text-xs font-mono text-white/30">
              {patient.id}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-white">
            {patient.name}
          </h1>

          <p className="mt-2 text-sm text-white/40">
            {patient.age} years • {patient.gender} • {patient.condition}
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${style.bg} ${style.border} ${style.text}`}
        >
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          {patient.risk} RISK
        </span>

      </div>


      {/* Critical banner */}
      {patient.risk === "CRITICAL" && (
        <div className="mt-7 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle
                size={20}
                className="text-red-400"
              />
            </div>

            <div>
              <p className="font-medium text-red-400">
                Immediate medical attention required
              </p>

              <p className="mt-1 text-sm text-white/45">
                LifeRoute AI has detected critical deterioration and recommends
                immediate emergency routing.
              </p>
            </div>

          </div>

        </div>
      )}


      {/* Current vitals */}
      <section className="mt-7">

        <div className="mb-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            Current Status
          </p>

          <h2 className="mt-1 text-lg font-medium text-white">
            Current vitals
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <VitalCard
            icon={HeartPulse}
            label="Heart Rate"
            value={patient.heartRate}
            unit="BPM"
          />

          <VitalCard
            icon={Wind}
            label="SpO₂"
            value={patient.spo2}
            unit="%"
          />

          <VitalCard
            icon={Thermometer}
            label="Temperature"
            value={patient.temperature}
            unit="°C"
          />

          <VitalCard
            icon={Activity}
            label="Activity"
            value={patient.activity}
            unit="level"
          />

        </div>

        <p className="mt-3 text-xs text-white/25">
          Last updated {patient.updated}
        </p>

      </section>


      {/* AI assessment + resources */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <section className="rounded-2xl border border-white/[0.08] bg-[#11151D]">

          <div className="border-b border-white/[0.07] p-6">

            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
              AI Assessment
            </p>

            <h2 className="mt-1 text-lg font-medium text-white">
              Risk assessment
            </h2>

          </div>

          <div className="p-6">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-xs text-white/30">
                  Risk score
                </p>

                <p className={`mt-1 text-4xl font-semibold ${style.text}`}>
                  {Math.round(patient.riskScore * 100)}%
                </p>
              </div>

              <span className={`text-sm font-medium ${style.text}`}>
                {patient.risk}
              </span>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-current transition-all"
                style={{
                  width: `${patient.riskScore * 100}%`,
                  color:
                    patient.risk === "CRITICAL"
                      ? "#F87171"
                      : patient.risk === "HIGH"
                      ? "#FB923C"
                      : patient.risk === "MEDIUM"
                      ? "#FACC15"
                      : "#34D399",
                }}
              />
            </div>

            <div className="mt-7">

              <p className="text-xs text-white/30">
                AI assessment reasons
              </p>

              <div className="mt-3 space-y-3">

                {patient.reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5A36]" />

                    <p className="text-sm text-white/55">
                      {reason}
                    </p>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>


        <section className="rounded-2xl border border-white/[0.08] bg-[#11151D]">

          <div className="border-b border-white/[0.07] p-6">

            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
              Care Coordination
            </p>

            <h2 className="mt-1 text-lg font-medium text-white">
              Resource requirements
            </h2>

          </div>

          <div className="p-6">

            <div className="space-y-4">

              {patient.resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF5A36]/10">
                    {resource.toLowerCase().includes("bed") ? (
                      <BedDouble size={17} className="text-[#FF7A5C]" />
                    ) : resource.toLowerCase().includes("monitor") ? (
                      <Activity size={17} className="text-[#FF7A5C]" />
                    ) : (
                      <Wind size={17} className="text-[#FF7A5C]" />
                    )}
                  </div>

                  <p className="text-sm text-white/60">
                    {resource}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

              <div className="flex items-center gap-3">
                <Stethoscope
                  size={17}
                  className="text-white/35"
                />

                <div>
                  <p className="text-xs text-white/30">
                    Routing status
                  </p>

                  <p className="mt-1 text-sm text-white/65">
                    {patient.routing}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>


      {/* Vital history */}
      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#11151D]">

        <div className="border-b border-white/[0.07] p-6">

          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            Monitoring History
          </p>

          <h2 className="mt-1 text-lg font-medium text-white">
            Vital history
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>
              <tr className="border-b border-white/[0.06] text-left">

                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Time
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Heart Rate
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  SpO₂
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Temperature
                </th>

                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Activity
                </th>

              </tr>
            </thead>

            <tbody>

              {patient.history.map((reading, index) => (
                <tr
                  key={reading.time}
                  className="border-b border-white/[0.05] last:border-0"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Clock size={14} className="text-white/25" />
                      {reading.time}
                    </div>

                  </td>

                  <td className="px-4 py-4 text-sm text-white/60">
                    {reading.hr} BPM
                  </td>

                  <td
                    className={`px-4 py-4 text-sm ${
                      reading.spo2 <= 92
                        ? "text-red-400"
                        : "text-white/60"
                    }`}
                  >
                    {reading.spo2}%
                  </td>

                  <td className="px-4 py-4 text-sm text-white/60">
                    {reading.temp}°C
                  </td>

                  <td className="px-6 py-4 text-sm text-white/60">
                    {reading.activity}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* Demo notice */}
      <div className="mt-5 rounded-xl border border-[#FF5A36]/10 bg-[#FF5A36]/[0.03] px-4 py-3">

        <p className="text-[11px] text-white/30">
          Demo mode — patient vitals and AI assessments are currently
          simulated. These values will be replaced with real monitoring data
          during backend integration.
        </p>

      </div>

    </div>
  );
}


function VitalCard({ icon: Icon, label, value, unit }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <Icon
          size={18}
          className="text-[#FF7A5C]"
        />
      </div>

      <p className="mt-5 text-xs text-white/35">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1.5">

        <span className="text-2xl font-semibold text-white">
          {value}
        </span>

        <span className="text-[11px] text-white/25">
          {unit}
        </span>

      </div>

    </div>
  );
}