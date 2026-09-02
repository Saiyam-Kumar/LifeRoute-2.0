import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BedDouble,
  HeartPulse,
  Radio,
  RefreshCw,
  Users,
  Wind,
} from "lucide-react";

const DEMO_PATIENTS = [
  {
    id: "P001",
    risk: "CRITICAL",
    heartRate: 118,
    spo2: 91,
    condition: "Critical deterioration",
    updated: "Just now",
  },
  {
    id: "P014",
    risk: "HIGH",
    heartRate: 108,
    spo2: 94,
    condition: "Needs monitoring",
    updated: "2 min ago",
  },
  {
    id: "P021",
    risk: "MEDIUM",
    heartRate: 96,
    spo2: 96,
    condition: "Under observation",
    updated: "5 min ago",
  },
  {
    id: "P008",
    risk: "STABLE",
    heartRate: 78,
    spo2: 98,
    condition: "Stable",
    updated: "8 min ago",
  },
];

const HOSPITAL_DATA = {
  name: "CityCare Multispeciality Hospital",
  type: "Multispeciality",
  emergencyLevel: "Level 2",
  availableBeds: 42,
  icuBeds: 8,
  ventilators: 5,
  specialists: 12,
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

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  accent = "orange",
}) {
  const accentClasses = {
    orange:
      "text-[#FF5A36] bg-[#FF5A36]/[0.08] border-[#FF5A36]/10",
    blue:
      "text-[#7C8CF5] bg-[#7C8CF5]/[0.08] border-[#7C8CF5]/10",
    green:
      "text-emerald-400 bg-emerald-400/[0.08] border-emerald-400/10",
    purple:
      "text-purple-400 bg-purple-400/[0.08] border-purple-400/10",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#11151D] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-[#141922]">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <Activity
          size={16}
          className="text-white/[0.12] transition-colors group-hover:text-white/20"
        />

      </div>

      <div className="mt-5">

        <p className="text-sm text-white/40">
          {label}
        </p>

        <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1.5 text-xs text-white/25">
          {description}
        </p>

      </div>

    </div>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#11151D] ${className}`}
    >
      <div className="border-b border-white/[0.07] px-6 py-5">

        {eyebrow && (
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>

      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const criticalPatients = DEMO_PATIENTS.filter(
    (patient) => patient.risk === "CRITICAL"
  );

  const highRiskPatients = DEMO_PATIENTS.filter(
    (patient) => patient.risk === "HIGH"
  );

  return (
    <div className="min-h-screen bg-[#0B0D12] px-6 py-8 lg:px-10 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* ====================================================== */}
        {/* HEADER                                                  */}
        {/* ====================================================== */}

        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#FF5A36]">
                Hospital Portal
              </span>

              <span className="h-1 w-1 rounded-full bg-white/20" />

              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                Live Command Center
              </span>

            </div>

            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {HOSPITAL_DATA.name}
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Monitor hospital capacity, patient risk, and emergency readiness.
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-4 py-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />

              <span className="text-xs font-medium text-emerald-300">
                Operational
              </span>

            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={16} />
            </button>

          </div>

        </header>


        {/* ====================================================== */}
        {/* CAPACITY STATS                                         */}
        {/* ====================================================== */}

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={BedDouble}
            label="Available Beds"
            value={HOSPITAL_DATA.availableBeds}
            description="General beds currently available"
            accent="orange"
          />

          <StatCard
            icon={HeartPulse}
            label="ICU Beds"
            value={HOSPITAL_DATA.icuBeds}
            description="Critical-care beds available"
            accent="blue"
          />

          <StatCard
            icon={Wind}
            label="Ventilators"
            value={HOSPITAL_DATA.ventilators}
            description="Ventilators currently available"
            accent="green"
          />

          <StatCard
            icon={AlertTriangle}
            label="Emergency Level"
            value={HOSPITAL_DATA.emergencyLevel}
            description="Current hospital readiness"
            accent="purple"
          />

        </div>


        {/* ====================================================== */}
        {/* IMMEDIATE ATTENTION                                    */}
        {/* ====================================================== */}

        <div className="mt-6">

          <SectionCard
            eyebrow="Requires Attention"
            title="Immediate Attention"
          >

            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.045] p-5">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <AlertTriangle size={21} />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="text-xs font-mono uppercase tracking-[0.18em] text-red-400">
                        Critical Patient
                      </span>

                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[9px] font-medium text-red-400">
                        IMMEDIATE
                      </span>

                    </div>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Patient P001
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      Critical deterioration detected by LifeRoute AI monitoring.
                    </p>

                  </div>

                </div>


                <div className="flex flex-wrap items-center gap-3">

                  <div className="rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3">

                    <p className="text-[9px] uppercase tracking-wider text-white/25">
                      SpO₂
                    </p>

                    <p className="mt-1 text-lg font-semibold text-red-400">
                      91%
                    </p>

                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3">

                    <p className="text-[9px] uppercase tracking-wider text-white/25">
                      Heart Rate
                    </p>

                    <p className="mt-1 text-lg font-semibold text-red-400">
                      118
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      navigate("/hospital/patients/P001")
                    }
                    className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-xs font-medium text-white transition hover:bg-red-400"
                  >
                    View Patient
                    <ArrowRight size={14} />
                  </button>

                </div>

              </div>

            </div>

          </SectionCard>

        </div>


        {/* ====================================================== */}
        {/* PATIENT OVERVIEW + AI STATUS                            */}
        {/* ====================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">


          {/* Patient overview */}

          <SectionCard
            eyebrow="Patient Monitoring"
            title="Patient Overview"
          >

            <div className="space-y-2">

              {DEMO_PATIENTS.map((patient) => {

                const style = riskStyles[patient.risk];

                return (
                  <button
                    key={patient.id}
                    onClick={() =>
                      navigate(`/hospital/patients/${patient.id}`)
                    }
                    className="group flex w-full flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-left transition hover:border-white/[0.12] hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">

                        <Users
                          size={16}
                          className="text-white/35"
                        />

                      </div>

                      <div>

                        <p className="text-sm font-medium text-white">
                          {patient.id}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          Updated {patient.updated}
                        </p>

                      </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-7">

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/20">
                          Heart Rate
                        </p>

                        <p className="mt-1 text-sm text-white/60">
                          {patient.heartRate} BPM
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/20">
                          SpO₂
                        </p>

                        <p
                          className={`mt-1 text-sm ${
                            patient.spo2 <= 92
                              ? "text-red-400"
                              : "text-white/60"
                          }`}
                        >
                          {patient.spo2}%
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-medium ${style.bg} ${style.border} ${style.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />

                        {patient.risk}
                      </span>

                      <ArrowRight
                        size={14}
                        className="hidden text-white/20 transition group-hover:text-white/60 md:block"
                      />

                    </div>

                  </button>
                );
              })}

            </div>


            <button
              onClick={() => navigate("/hospital/patients")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] py-3 text-xs text-white/45 transition hover:bg-white/[0.05] hover:text-white"
            >
              View All Patients
              <ArrowRight size={14} />
            </button>

          </SectionCard>


          {/* AI status */}

          <SectionCard
            eyebrow="AI Monitoring"
            title="Risk Distribution"
          >

            <div className="space-y-4">

              <RiskRow
                label="Critical"
                count={criticalPatients.length}
                total={DEMO_PATIENTS.length}
                color="red"
              />

              <RiskRow
                label="High Risk"
                count={highRiskPatients.length}
                total={DEMO_PATIENTS.length}
                color="orange"
              />

              <RiskRow
                label="Medium"
                count={
                  DEMO_PATIENTS.filter(
                    (p) => p.risk === "MEDIUM"
                  ).length
                }
                total={DEMO_PATIENTS.length}
                color="yellow"
              />

              <RiskRow
                label="Stable"
                count={
                  DEMO_PATIENTS.filter(
                    (p) => p.risk === "STABLE"
                  ).length
                }
                total={DEMO_PATIENTS.length}
                color="green"
              />

            </div>


            <div className="mt-7 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                  <Radio size={16} />
                </div>

                <div>

                  <p className="text-sm font-medium text-white/75">
                    AI monitoring active
                  </p>

                  <p className="mt-1 text-[11px] text-white/30">
                    {DEMO_PATIENTS.length} patients currently monitored
                  </p>

                </div>

              </div>

            </div>

          </SectionCard>

        </div>


        {/* ====================================================== */}
        {/* RESOURCES + EMERGENCY READINESS                        */}
        {/* ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">


          <SectionCard
            eyebrow="Capacity"
            title="Resource Availability"
          >

            <div className="space-y-6">

              <ResourceBar
                label="General Beds"
                value={HOSPITAL_DATA.availableBeds}
                max={100}
                icon={BedDouble}
              />

              <ResourceBar
                label="ICU Beds"
                value={HOSPITAL_DATA.icuBeds}
                max={25}
                icon={HeartPulse}
              />

              <ResourceBar
                label="Ventilators"
                value={HOSPITAL_DATA.ventilators}
                max={15}
                icon={Wind}
              />

            </div>


            <button
              onClick={() => navigate("/hospital/resources")}
              className="mt-6 flex items-center gap-2 text-xs text-[#FF7A5C] transition hover:text-[#FF9A82]"
            >
              Manage Resources
              <ArrowRight size={14} />
            </button>

          </SectionCard>


          <SectionCard
            eyebrow="Hospital Readiness"
            title="Emergency Readiness"
          >

            <div className="space-y-5">

              <InfoRow
                label="Emergency Level"
                value={HOSPITAL_DATA.emergencyLevel}
              />

              <InfoRow
                label="Hospital Type"
                value={HOSPITAL_DATA.type}
              />

              <InfoRow
                label="Operational Status"
                value="Currently Open"
              />

              <InfoRow
                label="Specialists"
                value={`${HOSPITAL_DATA.specialists} available`}
              />

            </div>


            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF5A36]/[0.08] text-[#FF7A5C]">
                  <Activity size={16} />
                </div>

                <div>

                  <p className="text-xs font-medium text-white/65">
                    LifeRoute network
                  </p>

                  <p className="mt-1 text-[11px] text-white/30">
                    Hospital is available for emergency resource matching.
                  </p>

                </div>

              </div>

            </div>

          </SectionCard>

        </div>


        {/* ====================================================== */}
        {/* DEMO NOTICE                                             */}
        {/* ====================================================== */}

        <div className="mt-7 flex items-start gap-3 rounded-xl border border-[#FF5A36]/10 bg-[#FF5A36]/[0.03] px-4 py-3">

          <Activity
            size={14}
            className="mt-0.5 shrink-0 text-[#FF7A5C]"
          />

          <p className="text-[11px] leading-5 text-white/30">
            Demo mode — patient monitoring, AI risk states, and hospital
            capacity values are currently simulated. These will be connected
            to the LifeRoute backend and Firestore during integration.
          </p>

        </div>


        {/* ====================================================== */}
        {/* FOOTER                                                  */}
        {/* ====================================================== */}

        <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5 text-[10px] text-white/20">

          <span>
            LifeRoute Hospital Command Center
          </span>

          <span className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />

            Demo Environment

          </span>

        </div>

      </div>
    </div>
  );
}


function ResourceBar({
  label,
  value,
  max,
  icon: Icon,
}) {
  const percentage = Math.min(
    (Number(value) / max) * 100,
    100
  );

  return (
    <div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-white/40">
            <Icon size={16} />
          </div>

          <span className="text-sm text-white/50">
            {label}
          </span>

        </div>

        <span className="text-lg font-semibold text-white">
          {value}
        </span>

      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className="h-full rounded-full bg-[#FF5A36] transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


function InfoRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-sm text-white/40">
        {label}
      </span>

      <span className="text-sm font-medium text-white/70">
        {value}
      </span>

    </div>
  );
}


function RiskRow({
  label,
  count,
  total,
  color,
}) {
  const percentage = total
    ? (count / total) * 100
    : 0;

  const styles = {
    red: "bg-red-400",
    orange: "bg-orange-400",
    yellow: "bg-yellow-400",
    green: "bg-emerald-400",
  };

  return (
    <div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <span
            className={`h-2 w-2 rounded-full ${styles[color]}`}
          />

          <span className="text-sm text-white/50">
            {label}
          </span>

        </div>

        <span className="text-sm font-medium text-white/70">
          {count}
        </span>

      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className={`h-full rounded-full ${styles[color]} transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}