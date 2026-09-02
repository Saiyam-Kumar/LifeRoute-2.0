import { useNavigate } from "react-router-dom";
import {
  Users,
  HeartPulse,
  AlertTriangle,
  Activity,
  Search,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const DEMO_PATIENTS = [
  {
    id: "P001",
    name: "Patient P001",
    age: 64,
    gender: "Male",
    risk: "CRITICAL",
    riskScore: 0.9,
    heartRate: 118,
    spo2: 91,
    temperature: 37.8,
    activity: 0.18,
    condition: "Deteriorating",
    lastUpdated: "Just now",
  },
  {
    id: "P014",
    name: "Patient P014",
    age: 52,
    gender: "Female",
    risk: "HIGH",
    riskScore: 0.72,
    heartRate: 108,
    spo2: 94,
    temperature: 37.4,
    activity: 0.28,
    condition: "Needs monitoring",
    lastUpdated: "2 min ago",
  },
  {
    id: "P021",
    name: "Patient P021",
    age: 47,
    gender: "Male",
    risk: "MEDIUM",
    riskScore: 0.48,
    heartRate: 96,
    spo2: 96,
    temperature: 37.1,
    activity: 0.39,
    condition: "Under observation",
    lastUpdated: "5 min ago",
  },
  {
    id: "P008",
    name: "Patient P008",
    age: 31,
    gender: "Female",
    risk: "STABLE",
    riskScore: 0.12,
    heartRate: 78,
    spo2: 98,
    temperature: 36.6,
    activity: 0.55,
    condition: "Stable",
    lastUpdated: "8 min ago",
  },
  {
    id: "P017",
    name: "Patient P017",
    age: 59,
    gender: "Male",
    risk: "HIGH",
    riskScore: 0.68,
    heartRate: 104,
    spo2: 93,
    temperature: 37.5,
    activity: 0.25,
    condition: "Needs monitoring",
    lastUpdated: "10 min ago",
  },
];

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

export default function Patients() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filteredPatients = DEMO_PATIENTS.filter((patient) => {
    const matchesSearch =
      patient.id.toLowerCase().includes(search.toLowerCase()) ||
      patient.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || patient.risk === filter;

    return matchesSearch && matchesFilter;
  });

  const counts = {
    total: DEMO_PATIENTS.length,
    critical: DEMO_PATIENTS.filter((p) => p.risk === "CRITICAL").length,
    high: DEMO_PATIENTS.filter((p) => p.risk === "HIGH").length,
    stable: DEMO_PATIENTS.filter((p) => p.risk === "STABLE").length,
  };

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">
                Hospital Portal
              </span>

              <span className="text-white/20">•</span>

              <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">
                Patient Management
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Patients
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Monitor patient conditions and review AI-assisted risk assessments.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-xs text-white/60">
              Live monitoring
            </span>
          </div>

        </div>
      </div>


      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <SummaryCard
          icon={Users}
          label="Total Patients"
          value={counts.total}
          iconClass="text-blue-400 bg-blue-500/10"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Critical"
          value={counts.critical}
          iconClass="text-red-400 bg-red-500/10"
        />

        <SummaryCard
          icon={Activity}
          label="High Risk"
          value={counts.high}
          iconClass="text-orange-400 bg-orange-500/10"
        />

        <SummaryCard
          icon={HeartPulse}
          label="Stable"
          value={counts.stable}
          iconClass="text-emerald-400 bg-emerald-500/10"
        />

      </div>


      {/* Search + filters */}
      <div className="mt-7 rounded-2xl border border-white/[0.08] bg-[#11151D] p-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-sm">

            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient ID..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#FF5A36]/30"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "STABLE"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-3 py-2 text-[11px] font-medium transition ${
                  filter === item
                    ? "bg-[#FF5A36]/10 text-[#FF7A5C] border border-[#FF5A36]/20"
                    : "border border-transparent text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

      </div>


      {/* Patient list */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11151D]">

        <div className="border-b border-white/[0.07] px-6 py-5">

          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
            Patient Queue
          </p>

          <h2 className="mt-1 text-lg font-medium text-white">
            Current patients
          </h2>

        </div>


        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">

          <table className="w-full">

            <thead>
              <tr className="border-b border-white/[0.06] text-left">
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Patient
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Risk
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Heart Rate
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  SpO₂
                </th>

                <th className="px-4 py-4 text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Condition
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-mono uppercase tracking-wider text-white/25">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredPatients.map((patient) => {
                const style = riskStyles[patient.risk];

                return (
                  <tr
                    key={patient.id}
                    className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
                          <span className="text-xs font-medium text-white/60">
                            {patient.id.slice(1)}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            {patient.name}
                          </p>

                          <p className="mt-1 text-[11px] text-white/30">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>

                      </div>

                    </td>


                    <td className="px-4 py-5">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium ${style.bg} ${style.border} ${style.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {patient.risk}
                      </span>

                    </td>


                    <td className="px-4 py-5">
                      <span className="text-sm text-white/70">
                        {patient.heartRate}
                      </span>
                      <span className="ml-1 text-xs text-white/25">
                        BPM
                      </span>
                    </td>


                    <td className="px-4 py-5">
                      <span className="text-sm text-white/70">
                        {patient.spo2}%
                      </span>
                    </td>


                    <td className="px-4 py-5">
                      <span className="text-sm text-white/45">
                        {patient.condition}
                      </span>

                      <p className="mt-1 text-[10px] text-white/20">
                        Updated {patient.lastUpdated}
                      </p>
                    </td>


                    <td className="px-6 py-5 text-right">

                      <button
                        onClick={() =>
                          navigate(`/hospital/patients/${patient.id}`)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/50 transition hover:border-[#FF5A36]/20 hover:bg-[#FF5A36]/[0.06] hover:text-[#FF7A5C]"
                      >
                        View
                        <ArrowRight size={13} />
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>


        {/* Mobile cards */}
        <div className="divide-y divide-white/[0.06] md:hidden">

          {filteredPatients.map((patient) => {
            const style = riskStyles[patient.risk];

            return (
              <button
                key={patient.id}
                onClick={() =>
                  navigate(`/hospital/patients/${patient.id}`)
                }
                className="w-full p-5 text-left transition hover:bg-white/[0.025]"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-medium text-white">
                      {patient.name}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] ${style.bg} ${style.border} ${style.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {patient.risk}
                  </span>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-white/[0.025] p-3">
                    <p className="text-[10px] text-white/25">
                      Heart Rate
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {patient.heartRate} BPM
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/[0.025] p-3">
                    <p className="text-[10px] text-white/25">
                      SpO₂
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {patient.spo2}%
                    </p>
                  </div>

                </div>

              </button>
            );
          })}

        </div>


        {filteredPatients.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-white/40">
              No patients found.
            </p>
          </div>
        )}

      </div>


      {/* Demo notice */}
      <div className="mt-5 rounded-xl border border-[#FF5A36]/10 bg-[#FF5A36]/[0.03] px-4 py-3">
        <p className="text-[11px] text-white/30">
          Demo mode — patient data is currently simulated. This will be
          connected to the LifeRoute backend and Firestore during integration.
        </p>
      </div>

    </div>
  );
}


function SummaryCard({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11151D] p-5">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={18} />
      </div>

      <p className="mt-5 text-xs text-white/35">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>

    </div>
  );
}